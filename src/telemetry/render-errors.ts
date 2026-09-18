import type { Instrumentation } from 'next';

/**
 * One structured log line per server render error, with what a shared cache
 * would need to know: whether the request was a Flight (RSC) navigation or a
 * prefetch. Next.js commits a Flight response's 200 before rendering finishes,
 * so these are the errors a cache keyed on status would store (DEV-24195).
 * Counting them is what decides whether navigations are worth caching.
 */
export type RenderErrorLog = {
    event: 'render_error';
    path: string;
    method: string;
    rsc: boolean;
    prefetch: boolean;
    routerKind: string;
    routePath: string;
    routeType: string;
    renderSource?: string;
    digest?: string;
    message: string;
};

export function describeRenderError(
    error: unknown,
    request: Parameters<Instrumentation.onRequestError>[1],
    context: Parameters<Instrumentation.onRequestError>[2],
): RenderErrorLog {
    const headers = request.headers;
    const header = (name: string) => {
        const value = headers[name];
        return Array.isArray(value) ? value[0] : value;
    };
    const digest =
        typeof error === 'object' && error !== null && 'digest' in error
            ? String((error as { digest: unknown }).digest)
            : undefined;
    return {
        event: 'render_error',
        path: request.path,
        method: request.method,
        rsc: header('rsc') === '1',
        prefetch: header('next-router-prefetch') === '1',
        routerKind: context.routerKind,
        routePath: context.routePath,
        routeType: context.routeType,
        renderSource: context.renderSource,
        digest,
        message: error instanceof Error ? error.message : String(error),
    };
}

export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
    console.error(JSON.stringify(describeRenderError(error, request, context)));
};
