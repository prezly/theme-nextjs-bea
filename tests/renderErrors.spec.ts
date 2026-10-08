import { expect, test } from '@playwright/test';

import { describeRenderError } from '../src/telemetry/render-errors';

const context = {
    routerKind: 'App Router',
    routePath: '/[localeCode]/(story)/[slug]',
    routeType: 'render',
    renderSource: 'react-server-components',
    revalidateReason: undefined,
} as const;

test('describes a Flight navigation render error with its digest and drops the query string', () => {
    const error = Object.assign(new Error('API Error (503): Service Unavailable'), {
        digest: '2172128361',
    });
    expect(
        describeRenderError(
            error,
            {
                path: '/en/story?_rsc=abc&preview=secret-token',
                method: 'GET',
                headers: { rsc: '1' },
            },
            context,
        ),
    ).toEqual({
        event: 'render_error',
        path: '/en/story',
        method: 'GET',
        rsc: true,
        prefetch: false,
        routerKind: 'App Router',
        routePath: '/[localeCode]/(story)/[slug]',
        routeType: 'render',
        renderSource: 'react-server-components',
        digest: '2172128361',
        message: 'API Error (503): Service Unavailable',
    });
});

test('distinguishes prefetches and HTML, and copes with non-Error values', () => {
    const prefetch = describeRenderError(
        'boom',
        { path: '/en', method: 'GET', headers: { rsc: ['1'], 'next-router-prefetch': '1' } },
        context,
    );
    expect(prefetch).toMatchObject({
        rsc: true,
        prefetch: true,
        digest: undefined,
        message: 'boom',
    });
    const html = describeRenderError(
        new Error('x'),
        { path: '/en', method: 'GET', headers: {} },
        context,
    );
    expect(html).toMatchObject({ rsc: false, prefetch: false });
});
