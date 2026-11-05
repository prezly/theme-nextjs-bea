import { expect, test } from '@playwright/test';
import { TrackingPolicy } from '@prezly/analytics-nextjs';
import { createPrezlyClient } from '@prezly/sdk';
import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';
import { NextRequest } from 'next/server';

import { createAnalyticsFacade } from '../src/utils/analytics';
import { middleware } from '../middleware';
import { fetchGalleryPreview } from '../src/adapters/server/gallery-preview';
import { GALLERY_PREVIEW_HEADER, isGalleryPreviewPath } from '../src/utils/galleryPreview';

const token = '00000000-0000-4000-8000-000000000001';

for (const [path, env, target] of [
    [`/media/preview/${token}`, {}, `/en/media/preview/${token}`],
    [`/nl/media/preview/${token}`, {}, `/nl_BE/media/preview/${token}`],
    [
        `/presscentre/nl_BE/news/media/preview/${token}`,
        {
            THEME_BASE_PATH: '/presscentre',
            THEME_LOCALE_SUBDIR: '*:news',
            THEME_LOCALE_SLUG_FORMAT: 'code',
        },
        `/nl_BE/media/preview/${token}`,
    ],
] as const) {
    test(`preview rewrite preserves context and privacy: ${path}`, async () => {
        const envHeader = JSON.stringify(env);
        const response = await middleware(
            new NextRequest(`https://example.test${path}`, {
                headers: { 'X-Newsroom-Locales': 'en,nl_BE', 'X-Prezly-Env': envHeader },
            }),
        );
        expect(response.headers.get('x-middleware-rewrite')).toBe(`https://example.test${target}`);
        expect(response.headers.get('Cache-Control')).toContain('no-store');
        expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
        expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
        expect(response.headers.get(`x-middleware-request-${GALLERY_PREVIEW_HEADER}`)).toBe('1');
        expect(response.headers.get('x-middleware-request-x-prezly-env')).toBe(envHeader);
        expect(response.headers.get('x-middleware-request-x-newsroom-locales')).toBe('en,nl_BE');
        expect(response.headers.has('X-Prezly-Cache-Policy')).toBe(false);
    });
}

test('ordinary albums ignore a spoofed preview marker and retain the normal route', async () => {
    const response = await middleware(
        new NextRequest('https://example.test/media/album/gallery-id', {
            headers: { 'X-Newsroom-Locales': 'en', [GALLERY_PREVIEW_HEADER]: '1' },
        }),
    );
    expect(response.headers.get('x-middleware-rewrite')).toBe(
        'https://example.test/en/media/album/gallery-id',
    );
    expect(response.headers.has(`x-middleware-request-${GALLERY_PREVIEW_HEADER}`)).toBe(false);
    expect(response.headers.has('X-Robots-Tag')).toBe(false);
});

test('SDK preview uses only the dedicated authenticated endpoint and fetches edits again', async () => {
    const requests: Array<{ url: string; authorization: string | null }> = [];
    const client = createPrezlyClient({
        accessToken: 'synthetic-test-token',
        baseUrl: 'https://isolated-api.example.test',
        fetch: async (input, init) => {
            requests.push({
                url: String(input),
                authorization: new Headers(init?.headers).get('authorization'),
            });
            return new Response(
                JSON.stringify({ gallery: { name: `Revision ${requests.length}` } }),
                {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
                },
            );
        },
    });
    expect(await fetchGalleryPreview(client, 'room', token)).toEqual({ name: 'Revision 1' });
    expect(await fetchGalleryPreview(client, 'room', token)).toEqual({ name: 'Revision 2' });
    expect(requests).toEqual(
        [1, 2].map(() => ({
            url: `https://isolated-api.example.test/v2/newsrooms/room/galleries/preview/${token}`,
            authorization: 'Bearer synthetic-test-token',
        })),
    );
});

for (const status of [403, 404, 410, 500]) {
    test(`preview API ${status} ${status === 500 ? 'propagates' : 'becomes not found'}`, async () => {
        const client = createPrezlyClient({
            accessToken: 'synthetic-test-token',
            fetch: async () =>
                new Response(JSON.stringify({ message: 'Unavailable' }), {
                    status,
                    headers: { 'content-type': 'application/json' },
                }),
        });
        if (status === 500)
            await expect(fetchGalleryPreview(client, 'room', token)).rejects.toMatchObject({
                status,
            });
        else expect(await fetchGalleryPreview(client, 'room', token)).toBeNull();
    });
}

test('preview detection covers prefixes and missing tokens without matching album routes', () => {
    expect(isGalleryPreviewPath(`/presscentre/fr_BE/news/media/preview/${token}`)).toBe(true);
    expect(isGalleryPreviewPath('/media/preview')).toBe(true);
    expect(isGalleryPreviewPath(`/media/album/${token}`)).toBe(false);
    expect(isGalleryPreviewPath('/media/previews')).toBe(false);
});

test('analytics facade suppresses delayed events after navigation without mutating its client', async () => {
    let path = '/media/album/public';
    const calls: string[] = [];
    const page = async () => {
        calls.push('page');
    };
    const track = async () => {
        calls.push('track');
    };
    const client = { page, track, init: async () => {}, setMeta: () => {}, setConsent: () => {} };
    const analytics = createAnalyticsFacade(client, () => !isGalleryPreviewPath(path));
    await analytics.page();
    await analytics.track('download');
    path = `/media/preview/${token}`;
    await analytics.page();
    await analytics.track('download');
    expect(calls).toEqual(['page', 'track']);
    expect(client.page).toBe(page);
    expect(client.track).toBe(track);
    path = '/media';
    await analytics.page();
    expect(calls).toEqual(['page', 'track', 'page']);
});


test('analytics facade preserves method receivers, including when callbacks are detached', async () => {
    class Client {
        calls: string[] = [];
        async init() { this.calls.push('init'); }
        setMeta() { this.calls.push('meta'); }
        setConsent() { this.calls.push('consent'); }
        async page() { this.calls.push('page'); }
        async track() { this.calls.push('track'); }
    }
    const client = new Client();
    const { init, setMeta, setConsent, page, track } = createAnalyticsFacade(client, () => true);
    await init({ trackingPolicy: TrackingPolicy.DISABLED, segment: false });
    setMeta({ newsroom: 'synthetic-newsroom' });
    setConsent({ categories: [] });
    await page();
    await track('download');
    expect(client.calls).toEqual(['init', 'meta', 'consent', 'page', 'track']);
});

for (const method of ['GET', 'HEAD', 'POST', 'PATCH']) {
    test(`prefixed ${method} requests preserve their request context`, async () => {
        const originalHandle = IntlMiddleware.handle;
        let routedRequest: NextRequest | undefined;
        IntlMiddleware.handle = async (request, options) => {
            routedRequest = request;
            return originalHandle(request, options);
        };
        const controller = new AbortController();
        const body = method === 'POST' || method === 'PATCH' ? 'publication settings' : undefined;
        try {
            await middleware(new NextRequest('https://example.test/presscentre/category/news', {
                method,
                body,
                signal: controller.signal,
                redirect: 'manual',
                headers: {
                    'X-Newsroom-Locales': 'en',
                    'X-Prezly-Env': JSON.stringify({ THEME_BASE_PATH: '/presscentre' }),
                    [GALLERY_PREVIEW_HEADER]: 'spoofed',
                },
            }));
            expect(routedRequest?.method).toBe(method);
            expect(routedRequest?.url).toBe('https://example.test/category/news');
            expect(routedRequest?.redirect).toBe('manual');
            expect(routedRequest?.headers.has(GALLERY_PREVIEW_HEADER)).toBe(false);
            expect(await routedRequest?.text()).toBe(body ?? '');
            controller.abort();
            expect(routedRequest?.signal.aborted).toBe(true);
        } finally {
            IntlMiddleware.handle = originalHandle;
        }
    });
}
