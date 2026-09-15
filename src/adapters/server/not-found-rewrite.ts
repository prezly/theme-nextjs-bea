import { type NextRequest, NextResponse } from 'next/server';

import { getStorySlugRejection } from '../../utils/isPossibleStorySlug';

/**
 * Theme Kit's IntlMiddleware rewrites every unmatched public path to
 * `/:localeCode/_error404`, which the story page serves by calling `notFound()`.
 * That rewrite target is indistinguishable from a story whose custom slug is
 * literally `_error404`, so the middleware marks its own rewrites with a
 * request header and the page short-circuits only when the marker is present.
 */
export const NOT_FOUND_REWRITE_SLUG = '_error404';
export const NOT_FOUND_REQUEST_HEADER = 'x-prezly-not-found-rewrite';
export const NOT_FOUND_REQUEST_VALUE = '1';

/** Whether a middleware response is the IntlMiddleware not-found rewrite. */
export function isNotFoundRewrite(response: { headers: Headers }): boolean {
    const rewrite = response.headers.get('x-middleware-rewrite');
    if (!rewrite) return false;
    try {
        return new URL(rewrite).pathname.endsWith(`/${NOT_FOUND_REWRITE_SLUG}`);
    } catch {
        return false;
    }
}

export type NotFoundRewriteLog = {
    event: 'newsroom_not_found_rewrite';
    reason: NonNullable<ReturnType<typeof getStorySlugRejection>> | 'unmatched_path';
    path: string;
};

/**
 * Re-issue the IntlMiddleware not-found rewrite with the marker request header,
 * keeping IntlMiddleware's own response headers such as the locale code.
 *
 * One structured log line per rewrite makes a false positive findable by
 * path; scanner traffic bounds the volume to a few lines per second.
 */
export function markNotFoundRewrite(
    request: NextRequest,
    intlResponse: NextResponse,
    log: (entry: NotFoundRewriteLog) => void = (entry) => console.info(JSON.stringify(entry)),
): NextResponse {
    const rewrite = intlResponse.headers.get('x-middleware-rewrite');
    if (!rewrite) return intlResponse;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(NOT_FOUND_REQUEST_HEADER, NOT_FOUND_REQUEST_VALUE);
    const response = NextResponse.rewrite(new URL(rewrite), {
        request: { headers: requestHeaders },
    });
    intlResponse.headers.forEach((value, name) => {
        if (!name.startsWith('x-middleware-')) response.headers.set(name, value);
    });

    const [segment, ...rest] = request.nextUrl.pathname.split('/').filter(Boolean);
    const reason = rest.length === 0 && segment ? getStorySlugRejection(segment) : undefined;
    log({
        event: 'newsroom_not_found_rewrite',
        reason: reason ?? 'unmatched_path',
        path: request.nextUrl.pathname,
    });

    return response;
}
