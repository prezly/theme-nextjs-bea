import { expect, test } from '@playwright/test';
import { NextRequest } from 'next/server';

import { middleware } from '../middleware';
import { parseHomepageRedirects } from '../src/utils/homepageRedirect';

// press.brusselsairlines.com → latestnews.brusselsairlines.com, in short.
const LOCALES = 'en,nl_BE,fr,de_DE';
const REDIRECTS = {
    en: 'https://live.example.test/',
    nl_BE: 'https://live.example.test/nl',
    fr: 'https://live.example.test/fr',
    de_DE: 'https://live.example.test/',
};

async function run(
    path: string,
    themeEnv: Record<string, string> = {
        THEME_HOMEPAGE_REDIRECTS: JSON.stringify(REDIRECTS),
    },
    method = 'GET',
) {
    const headers: Record<string, string> = {
        'X-Newsroom-Locales': LOCALES,
        'X-Prezly-Env': JSON.stringify(themeEnv),
    };
    const response = await middleware(
        new NextRequest(`https://example.test${path}`, { headers, method }),
    );
    return {
        status: response.status,
        location: response.headers.get('location'),
        cacheControl: response.headers.get('cache-control'),
        rewrite: response.headers.get('x-middleware-rewrite'),
    };
}

test.describe('crisis mode homepage redirect', () => {
    test('the homepage goes to the live site, uncached and temporary', async () => {
        expect(await run('/')).toMatchObject({
            status: 302,
            location: 'https://live.example.test/',
            cacheControl: 'private, no-store',
        });
    });

    test('every language version of the homepage goes to its own target', async () => {
        expect((await run('/nl')).location).toBe('https://live.example.test/nl');
        expect((await run('/nl-be')).location).toBe('https://live.example.test/nl');
        expect((await run('/fr')).location).toBe('https://live.example.test/fr');
        expect((await run('/de')).location).toBe('https://live.example.test/');
        expect((await run('/nl/')).location).toBe('https://live.example.test/nl');
    });

    test('the default locale prefix redirects in one step', async () => {
        expect(await run('/en')).toMatchObject({
            status: 302,
            location: 'https://live.example.test/',
        });
    });

    test('campaign parameters come along, other parameters do not', async () => {
        expect((await run('/fr?utm_source=x&utm_medium=email&page=2')).location).toBe(
            'https://live.example.test/fr?utm_source=x&utm_medium=email',
        );
    });

    test('other pages keep working', async () => {
        for (const path of ['/category/news', '/nl/category/news', '/media', '/nl/search', '/fr/tag/x']) {
            const { status, location } = await run(path);
            expect({ path, status, location }).toEqual({ path, status: 200, location: null });
        }
    });

    test('only GET and HEAD redirect', async () => {
        expect((await run('/', undefined, 'HEAD')).location).toBe('https://live.example.test/');
        expect((await run('/', undefined, 'POST')).location).toBeNull();
    });

    test('without the setting the homepage is served as usual', async () => {
        expect(await run('/', {})).toMatchObject({ status: 200, location: null });
        expect((await run('/en', {})).location).toBe('https://example.test/');
    });

    test('a language without a target is served as usual', async () => {
        const env = { THEME_HOMEPAGE_REDIRECTS: JSON.stringify({ en: 'https://live.example.test/' }) };
        expect((await run('/', env)).location).toBe('https://live.example.test/');
        expect(await run('/fr', env)).toMatchObject({ status: 200, location: null });
    });

    test('behind a reverse proxy the base path is stripped first', async () => {
        const env = {
            THEME_BASE_PATH: '/presscentre',
            THEME_HOMEPAGE_REDIRECTS: JSON.stringify(REDIRECTS),
        };
        expect((await run('/presscentre', env)).location).toBe('https://live.example.test/');
        expect((await run('/presscentre/fr', env)).location).toBe('https://live.example.test/fr');
        expect((await run('/presscentre/category/news', env)).location).toBeNull();
    });
});

test('reads the header exactly as the app sends it', async () => {
    // NewsroomIngressDataRedisStorage: a base64 data URL, the map itself JSON-encoded inside.
    const env = { PREZLY_NEWSROOM_UUID: 'x', THEME_HOMEPAGE_REDIRECTS: JSON.stringify(REDIRECTS) };
    const header = `data:application/json;base64,${Buffer.from(JSON.stringify(env)).toString('base64')}`;
    const response = await middleware(
        new NextRequest('https://example.test/fr', {
            headers: { 'X-Newsroom-Locales': LOCALES, 'X-Prezly-Env': header },
        }),
    );
    expect(response.headers.get('location')).toBe('https://live.example.test/fr');
});

test.describe('parseHomepageRedirects', () => {
    test('accepts a JSON string or an object', () => {
        expect(parseHomepageRedirects(JSON.stringify(REDIRECTS))).toEqual(REDIRECTS);
        expect(parseHomepageRedirects(REDIRECTS)).toEqual(REDIRECTS);
    });

    test('ignores empty, broken and non-http values', () => {
        expect(parseHomepageRedirects(undefined)).toBeUndefined();
        expect(parseHomepageRedirects('')).toBeUndefined();
        expect(parseHomepageRedirects('{not json')).toBeUndefined();
        expect(parseHomepageRedirects('[]')).toBeUndefined();
        expect(parseHomepageRedirects({ en: 'javascript:alert(1)' })).toBeUndefined();
        expect(parseHomepageRedirects({ en: 'https://ok.test/', fr: 42 })).toEqual({
            en: 'https://ok.test/',
        });
    });
});
