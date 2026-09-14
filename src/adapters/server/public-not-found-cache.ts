/** An origin-only contract consumed by newsroom Varnish, never Cache-Control. */
export const PUBLIC_NOT_FOUND_HEADER = 'X-Prezly-Cache-Policy';
export const PUBLIC_NOT_FOUND_POLICY = 'public-story-404-v1';

const PRIVATE_REQUEST_HEADERS = [
    'authorization',
    'cookie',
    'rsc',
    'next-router-state-tree',
    'next-router-prefetch',
    'next-router-segment-prefetch',
    'x-middleware-prefetch',
    'x-now-route-matches',
    'x-fresh',
    // Varnish preserves cookies and Flight context: it removes cookies, and
    // Next.js strips Flight headers before invoking middleware.
    'x-prezly-negative-cache-bypass',
];

const TRACKING_PARAMETERS = new Set([
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
]);

export function isPublicNotFoundCandidate(
    request: { method: string; headers: Headers; url: string },
    mode: string | undefined,
): boolean {
    return (
        mode !== 'preview' &&
        (request.method === 'GET' || request.method === 'HEAD') &&
        !PRIVATE_REQUEST_HEADERS.some((name) => request.headers.has(name)) &&
        [...new URL(request.url).searchParams.keys()].every((key) => TRACKING_PARAMETERS.has(key))
    );
}

/**
 * ContentDelivery maps 403/404/410 to null. Only an observed 404 may grant the
 * policy. A cached/coalesced null without an observed response fails closed.
 * The observer neither changes responses nor adds an API request.
 */
export async function observePublicStoryLookup<T>(
    load: (fetch: typeof globalThis.fetch) => Promise<T | null>,
    fetchImpl: typeof globalThis.fetch = globalThis.fetch,
) {
    let responseCount = 0;
    let responseStatus: number | undefined;
    const story = await load(async (input, init) => {
        const response = await fetchImpl(input, init);
        responseCount += 1;
        responseStatus = response.status;
        return response;
    });

    return {
        story,
        confirmedNotFound: story === null && responseCount === 1 && responseStatus === 404,
    };
}
