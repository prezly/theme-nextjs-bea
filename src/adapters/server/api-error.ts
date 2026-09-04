import { environment } from './environment';

/*
 * Rejected tenant credentials (revoked or rotated newsroom token) surface as
 * SDK `ApiError`s on every request, but the framework-logged error does not
 * identify the tenant. The helpers here detect those errors and log them with
 * the request host and newsroom UUID, so the broken tenant can be found from
 * the logs.
 */

const LOG_THROTTLE_MS = 60_000;
const MAX_TRACKED_TENANTS = 1_000;

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
                        if (isApiAuthError(error)) {
                            logApiAuthFailure(error.status, requestHeaders);
                        }
                        throw error;
                    });
                }

                return result;
            };
        },
    });
}

/**
 * Logs an API auth failure with tenant identification, at most once per
 * newsroom per minute.
 */
export function logApiAuthFailure(status: number, requestHeaders: Headers) {
    const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? 'unknown';
    const newsroom = identifyNewsroom(requestHeaders) ?? 'unknown';

    if (!shouldLog(`${newsroom}:${status}`, Date.now())) {
        return;
    }

    console.warn(
        `Prezly API rejected the access token (${status}) for newsroom=${newsroom} host=${host}. ` +
            'The token configured for this site is likely revoked or rotated.',
    );
}

function shouldLog(key: string, now: number): boolean {
    const loggedAt = lastLoggedAt.get(key);

    if (loggedAt !== undefined && now - loggedAt < LOG_THROTTLE_MS) {
        return false;
    }

    if (lastLoggedAt.size >= MAX_TRACKED_TENANTS) {
        for (const [trackedKey, trackedAt] of lastLoggedAt) {
            if (now - trackedAt >= LOG_THROTTLE_MS) {
                lastLoggedAt.delete(trackedKey);
            }
        }
        // If every tracked entry is still within the throttle window, drop the
        // oldest one (Map iterates in insertion order) to keep the size bounded.
        if (lastLoggedAt.size >= MAX_TRACKED_TENANTS) {
            const oldest = lastLoggedAt.keys().next().value;
            if (oldest !== undefined) {
                lastLoggedAt.delete(oldest);
            }
        }
    }

    // Delete before set, so refreshed keys move to the back of the eviction order.
    lastLoggedAt.delete(key);
    lastLoggedAt.set(key, now);

    return true;
}

function identifyNewsroom(requestHeaders: Headers): string | undefined {
    try {
        return environment(requestHeaders).PREZLY_NEWSROOM_UUID;
    } catch {
        return undefined;
    }
}
