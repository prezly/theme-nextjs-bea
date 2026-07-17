import { environment } from './environment';

/*
 * Rejected tenant credentials (revoked or rotated newsroom token) surface as
 * SDK `ApiError`s on every request, but the framework-logged error does not
 * identify the tenant. The helpers here detect those errors and log them with
 * the request host and newsroom UUID, so the broken tenant can be found from
 * the logs.
 */

const LOG_THROTTLE_MS = 60_000;

const lastLoggedAt = new Map<string, number>();

/**
 * Detected by shape rather than `instanceof ApiError` — multiple copies of
 * `@prezly/sdk` can end up in the server bundle, each with its own class.
 */
export function isApiAuthError(error: unknown): error is Error & { status: number } {
    return (
        error instanceof Error &&
        'status' in error &&
        (error.status === 401 || error.status === 403)
    );
}

/**
 * Wraps a client object so that API auth failures thrown from any of its
 * methods are logged with tenant identification (at most once per newsroom
 * per minute). The error is rethrown untouched.
 */
export function reportApiAuthErrors<T extends object>(client: T, requestHeaders: Headers): T {
    return new Proxy(client, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);

            if (typeof value !== 'function') {
                return value;
            }

            return (...args: unknown[]) => {
                const result = Reflect.apply(value, target, args);

                if (result instanceof Promise) {
                    return result.catch((error: unknown) => {
                        logApiAuthError(error, requestHeaders);
                        throw error;
                    });
                }

                return result;
            };
        },
    });
}

function logApiAuthError(error: unknown, requestHeaders: Headers) {
    if (!isApiAuthError(error)) {
        return;
    }

    const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? 'unknown';
    const newsroom = identifyNewsroom(requestHeaders) ?? 'unknown';

    const key = `${newsroom}:${error.status}`;
    const now = Date.now();
    const loggedAt = lastLoggedAt.get(key);

    if (loggedAt !== undefined && now - loggedAt < LOG_THROTTLE_MS) {
        return;
    }
    lastLoggedAt.set(key, now);

    console.warn(
        `Prezly API rejected the access token (${error.status}) for newsroom=${newsroom} host=${host}. ` +
            'The token configured for this site is likely revoked or rotated.',
    );
}

function identifyNewsroom(requestHeaders: Headers): string | undefined {
    try {
        return environment(requestHeaders).PREZLY_NEWSROOM_UUID;
    } catch {
        return undefined;
    }
}
