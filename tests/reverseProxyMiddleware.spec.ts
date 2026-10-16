import { expect, test } from '@playwright/test';
import { NextRequest } from 'next/server';

import { middleware } from '../middleware';

// The locales header keeps the middleware off the API. These cases avoid the
// story route, whose locale resolution would look the slug up.
const LOCALES = 'en,nl_BE,fr_BE';

async function run(path: string, themeEnv?: Record<string, string>) {
    const headers: Record<string, string> = { 'X-Newsroom-Locales': LOCALES };
    if (themeEnv) headers['X-Prezly-Env'] = JSON.stringify(themeEnv);
    const response = await middleware(new NextRequest(`https://example.test${path}`, { headers }));
    return {
        rewrite: response.headers.get('x-middleware-rewrite'),
        location: response.headers.get('location'),
    };
}

test.describe('without reverse-proxy settings', () => {
    test('locale-aware routes rewrite to the default locale', async () => {
        expect(await run('/category/news')).toEqual({
            rewrite: 'https://example.test/en/category/news',
            location: null,
        });
    });

    test('an empty X-Prezly-Env changes nothing', async () => {
        expect(await run('/nl/search', {})).toEqual(await run('/nl/search'));
    });

    test('prefixed paths are not stripped', async () => {
        const { rewrite } = await run('/presscentre/category/news');
        expect(rewrite).not.toBe('https://example.test/en/category/news');
    });
});

test.describe('with THEME_BASE_PATH', () => {
    const env = { THEME_BASE_PATH: '/presscentre' };

    test('strips the base path before routing', async () => {
        expect(await run('/presscentre/category/news', env)).toEqual({
            rewrite: 'https://example.test/en/category/news',
            location: null,
        });
    });

    test('tunnels /api calls through the base path', async () => {
        expect(await run('/presscentre/api/stories?offset=6', env)).toEqual({
            rewrite: 'https://example.test/api/stories?offset=6',
            location: null,
        });
    });
});

test.describe('with THEME_LOCALE_SUBDIR and THEME_LOCALE_SLUG_FORMAT', () => {
    const env = { THEME_LOCALE_SUBDIR: '*:news', THEME_LOCALE_SLUG_FORMAT: 'code' };

    test('strips the subdir after the locale', async () => {
        expect(await run('/nl_BE/news/category/x', env)).toEqual({
            rewrite: 'https://example.test/nl_BE/category/x',
            location: null,
        });
    });

    test('tunnels /api calls through the locale subdir', async () => {
        expect(await run('/fr_BE/news/api/galleries', env)).toEqual({
            rewrite: 'https://example.test/api/galleries',
            location: null,
        });
    });

    test('redirects to the configured slug format and keeps the subdir', async () => {
        const { location } = await run('/nl-be/news/category/x', env);
        expect(location).toBe('https://example.test/nl_BE/news/category/x');
    });
});

test.describe('redirects keep a per-locale subdir', () => {
    const env = { THEME_LOCALE_SUBDIR: 'nl_BE:news', THEME_LOCALE_SLUG_FORMAT: 'iso-lower' };

    test('when the request spells the locale differently', async () => {
        const { location } = await run('/nl_BE/news/search', env);
        expect(location).toBe('https://example.test/nl-be/news/search');
    });
});

test.describe('THEME_LOCALE_SLUG_FORMAT=short', () => {
    test('behaves like an unset slug format', async () => {
        for (const path of ['/presscentre/nl/search', '/presscentre/category/x', '/presscentre/nl_BE/search']) {
            expect(await run(path, { THEME_BASE_PATH: '/presscentre', THEME_LOCALE_SLUG_FORMAT: 'short' })).toEqual(
                await run(path, { THEME_BASE_PATH: '/presscentre' }),
            );
        }
    });
});

test('tunnels /api calls below a base path and a locale segment', async () => {
    const env = { THEME_BASE_PATH: '/presscentre', THEME_LOCALE_SLUG_FORMAT: 'code' };
    expect(await run('/presscentre/nl_BE/api/stories', env)).toEqual({
        rewrite: 'https://example.test/api/stories',
        location: null,
    });
});

async function runWithCulture(path: string, themeEnv?: Record<string, string>) {
    const headers: Record<string, string> = {
        'X-Newsroom-Locales': LOCALES,
        'X-Prezly-Reverse-Proxy-Culture': 'fr_BE',
    };
    if (themeEnv) headers['X-Prezly-Env'] = JSON.stringify(themeEnv);
    const response = await middleware(new NextRequest(`https://example.test${path}`, { headers }));
    return response.headers.get('x-middleware-rewrite');
}

test('honours X-Prezly-Reverse-Proxy-Culture for reverse-proxy newsrooms', async () => {
    expect(await runWithCulture('/news/search', { THEME_LOCALE_SUBDIR: '*:news' })).toBe(
        'https://example.test/fr_BE/search',
    );
});

test('ignores X-Prezly-Reverse-Proxy-Culture without reverse-proxy settings', async () => {
    expect(await runWithCulture('/search')).toBe('https://example.test/en/search');
});
