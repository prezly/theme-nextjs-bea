import { expect, test } from '@playwright/test';

import {
    applyBasePath,
    applyBasePathAbsolute,
    createToLocaleSlug,
    hasPublicUrlOverrides,
    parseBasePathConfig,
    resolveLocaleCode,
    stripBasePath,
} from '../src/utils/basePath';

/**
 * Pure-logic unit tests for the reverse-proxy path helpers. No browser/server
 * needed — these exercise `applyBasePath` (outbound URL generation) and
 * `stripBasePath` (inbound middleware normalization) and their round-trip.
 */

// Same subdir for every locale, full locale code in the path.
const codeWithSubdir = parseBasePathConfig({
    THEME_LOCALE_SUBDIR: '*:news',
    THEME_LOCALE_SLUG_FORMAT: 'code',
});
// Short mode: subdir configured, no slug format (e.g. an earlier ali-newsroom setup).
const short = parseBasePathConfig({ THEME_LOCALE_SUBDIR: '*:news' });
// Stock: no reverse-proxy config at all — paths must stay unchanged.
const stock = parseBasePathConfig({});

test.describe('applyBasePath (outbound)', () => {
    test('code format — story routes get locale + subdir prefix (incl. default locale)', () => {
        expect(applyBasePath('/my-story', codeWithSubdir, 'fr_BE')).toBe('/fr_BE/news/my-story');
        expect(applyBasePath('/my-story', codeWithSubdir, 'nl_BE')).toBe('/nl_BE/news/my-story');
    });

    test('code format — locale-aware routes keep their locale, gain the subdir', () => {
        expect(applyBasePath('/fr_BE/category/x', codeWithSubdir, 'fr_BE')).toBe('/fr_BE/news/category/x');
        expect(applyBasePath('/nl_BE/search', codeWithSubdir, 'nl_BE')).toBe('/nl_BE/news/search');
        expect(applyBasePath('/fr_BE', codeWithSubdir, 'fr_BE')).toBe('/fr_BE/news');
    });

    test('short mode — subdir only, no locale prefix on story routes', () => {
        expect(applyBasePath('/my-story', short, 'fr_BE')).toBe('/news/my-story');
    });

    test('stock — no config is a no-op', () => {
        expect(applyBasePath('/my-story', stock, 'fr_BE')).toBe('/my-story');
        expect(applyBasePath('/fr_BE/category/x', stock, 'fr_BE')).toBe('/fr_BE/category/x');
    });
});

test.describe('applyBasePathAbsolute', () => {
    test('code format — prefixes the path and keeps the origin and query', () => {
        expect(applyBasePathAbsolute('https://x.prezly.com/my-story?a=1', codeWithSubdir, 'nl_BE')).toBe(
            'https://x.prezly.com/nl_BE/news/my-story?a=1',
        );
    });

    const backendOrigin = 'https://x.prezly.com';
    const withOrigin = {
        ...parseBasePathConfig({
            THEME_BASE_PATH: '/presscentre',
            THEME_PUBLIC_ORIGIN: 'https://www.example.com',
        }),
        backendOrigin,
    };

    test('public origin — swaps the backend origin and applies the prefix', () => {
        expect(applyBasePathAbsolute('https://x.prezly.com/my-story#top', withOrigin, 'en')).toBe(
            'https://www.example.com/presscentre/my-story#top',
        );
    });

    test('public origin only — swaps the origin and keeps the path', () => {
        const config = {
            ...parseBasePathConfig({ THEME_PUBLIC_ORIGIN: 'https://www.example.com' }),
            backendOrigin,
        };
        expect(applyBasePathAbsolute('https://x.prezly.com/my-story', config, 'en')).toBe(
            'https://www.example.com/my-story',
        );
    });

    test('keeps the public host for paths that start with //', () => {
        const config = {
            ...parseBasePathConfig({ THEME_PUBLIC_ORIGIN: 'https://www.example.com' }),
            backendOrigin,
        };
        expect(applyBasePathAbsolute('https://x.prezly.com//evil.example/story', config, 'en')).toBe(
            'https://www.example.com//evil.example/story',
        );
        expect(
            applyBasePathAbsolute('https://x.prezly.com//evil.example/story', withOrigin, 'en'),
        ).toMatch(/^https:\/\/www\.example\.com\//);
    });

    test('uses the public port and protocol', () => {
        const config = {
            ...parseBasePathConfig({ THEME_PUBLIC_ORIGIN: 'http://localhost:3000' }),
            backendOrigin,
        };
        expect(applyBasePathAbsolute('https://x.prezly.com/my-story', config, 'en')).toBe(
            'http://localhost:3000/my-story',
        );
    });

    test('leaves URLs of other newsrooms untouched', () => {
        expect(applyBasePathAbsolute('https://other.prezly.com/a-story', withOrigin, 'en')).toBe(
            'https://other.prezly.com/a-story',
        );
    });

    test('stock — returns the URL untouched, without normalizing it', () => {
        expect(applyBasePathAbsolute('https://x.prezly.com', stock, 'fr_BE')).toBe(
            'https://x.prezly.com',
        );
    });
});

test.describe('stripBasePath (inbound)', () => {
    test('code format — story routes drop both locale and subdir', () => {
        // /:slug pattern has no locale segment; resolveLocale recovers it from the slug.
        expect(stripBasePath('/fr_BE/news/my-story', codeWithSubdir)).toBe('/my-story');
        expect(stripBasePath('/nl_BE/news/my-story', codeWithSubdir)).toBe('/my-story');
        expect(stripBasePath('/fr_BE/news/s/uuid', codeWithSubdir)).toBe('/s/uuid');
    });

    test('code format — locale-aware routes keep the locale, drop the subdir', () => {
        expect(stripBasePath('/fr_BE/news/category/x', codeWithSubdir)).toBe('/fr_BE/category/x');
        expect(stripBasePath('/nl_BE/news/search', codeWithSubdir)).toBe('/nl_BE/search');
        expect(stripBasePath('/fr_BE/news', codeWithSubdir)).toBe('/fr_BE');
    });

    test('short mode — front subdir stripped', () => {
        expect(stripBasePath('/news/my-story', short)).toBe('/my-story');
    });

    test('stock — no config is a no-op', () => {
        expect(stripBasePath('/fr_BE/news/my-story', stock)).toBe('/fr_BE/news/my-story');
    });
});

test.describe('round-trip (apply then strip recovers the routable path)', () => {
    for (const [locale, route, routable] of [
        ['fr_BE', '/my-story', '/my-story'], // story → locale dropped, recovered via resolveLocale
        ['nl_BE', '/my-story', '/my-story'],
        ['fr_BE', '/fr_BE/category/x', '/fr_BE/category/x'], // locale-aware → locale preserved
        ['nl_BE', '/nl_BE/search', '/nl_BE/search'],
    ] as const) {
        test(`${locale} ${route}`, () => {
            const emitted = applyBasePath(route, codeWithSubdir, locale);
            expect(stripBasePath(emitted, codeWithSubdir)).toBe(routable);
        });
    }
});

test.describe('THEME_PUBLIC_ORIGIN', () => {
    const parse = (value: string) => parseBasePathConfig({ THEME_PUBLIC_ORIGIN: value }).publicOrigin;

    test('accepts an origin, with or without a trailing slash or port', () => {
        expect(parse('https://www.example.com')).toBe('https://www.example.com');
        expect(parse(' https://www.example.com/ ')).toBe('https://www.example.com');
        expect(parse('http://localhost:3000')).toBe('http://localhost:3000');
    });

    test('ignores anything that is not just an origin', () => {
        expect(parse('https://www.example.com/presscentre')).toBeUndefined();
        expect(parse('https://www.example.com/?a=1')).toBeUndefined();
        expect(parse('https://user:pass@www.example.com')).toBeUndefined();
        expect(parse('ftp://www.example.com')).toBeUndefined();
        expect(parse('www.example.com')).toBeUndefined();
    });

    test('counts as a public URL override on its own, but not as a path prefix', () => {
        const config = parseBasePathConfig({ THEME_PUBLIC_ORIGIN: 'https://www.example.com' });
        expect(hasPublicUrlOverrides(config)).toBe(true);
        expect(hasPublicUrlOverrides(parseBasePathConfig({}))).toBe(false);
    });
});

test.describe('every emitted shape is recognized on the way in', () => {
    const configs = {
        'base path + code, no subdir': parseBasePathConfig({
            THEME_BASE_PATH: '/presscentre',
            THEME_LOCALE_SLUG_FORMAT: 'code',
        }),
        'per-locale subdir, no wildcard, short': parseBasePathConfig({
            THEME_LOCALE_SUBDIR: 'nl_BE:news,fr_BE:actualites',
        }),
        'per-locale subdir, no wildcard, code': parseBasePathConfig({
            THEME_LOCALE_SUBDIR: 'nl_BE:news,fr_BE:actualites',
            THEME_LOCALE_SLUG_FORMAT: 'code',
        }),
        'base path + per-locale subdir, iso-lower': parseBasePathConfig({
            THEME_BASE_PATH: '/presscentre',
            THEME_LOCALE_SUBDIR: 'nl_BE:news',
            THEME_LOCALE_SLUG_FORMAT: 'iso-lower',
        }),
        'slug format only': parseBasePathConfig({ THEME_LOCALE_SLUG_FORMAT: 'code' }),
    };
    // de_DE has no subdir in the per-locale maps.
    const locales = ['nl_BE', 'fr_BE', 'de_DE'];
    const localeLessRoutes = ['/my-story', '/s/some-uuid', '/api/stories'];

    for (const [name, config] of Object.entries(configs)) {
        for (const locale of locales) {
            for (const route of localeLessRoutes) {
                test(`${name}: ${locale} ${route}`, () => {
                    expect(stripBasePath(applyBasePath(route, config, locale), config)).toBe(route);
                });
            }

            const slug = createToLocaleSlug(config.localeSlugFormat)?.(locale) ?? locale.split('_')[0];
            for (const route of [`/${slug}/category/x`, `/${slug}/search`]) {
                test(`${name}: ${locale} ${route}`, () => {
                    expect(stripBasePath(applyBasePath(route, config, locale), config)).toBe(route);
                });
            }
        }
    }

    test('base path + code: the locale segment of a story link is dropped', () => {
        const config = configs['base path + code, no subdir'];
        expect(applyBasePath('/my-story', config, 'nl_BE')).toBe('/presscentre/nl_BE/my-story');
        expect(stripBasePath('/presscentre/nl_BE/my-story', config)).toBe('/my-story');
        expect(stripBasePath('/presscentre/nl_BE/api/stories', config)).toBe('/api/stories');
    });

    test('per-locale subdir without wildcard: story links lose their subdir', () => {
        const config = configs['per-locale subdir, no wildcard, short'];
        expect(applyBasePath('/my-story', config, 'fr_BE')).toBe('/actualites/my-story');
        expect(stripBasePath('/actualites/my-story', config)).toBe('/my-story');
    });

    test('never takes a route or the API for a locale', () => {
        const config = configs['base path + code, no subdir'];
        expect(stripBasePath('/presscentre/api/stories', config)).toBe('/api/stories');
        expect(stripBasePath('/presscentre/tag/foo', config)).toBe('/tag/foo');
        expect(stripBasePath('/presscentre/search', config)).toBe('/search');
    });

    test('subdir keys match any spelling of the locale code', () => {
        const config = parseBasePathConfig({ THEME_LOCALE_SUBDIR: 'nl-BE:news' });
        expect(applyBasePath('/my-story', config, 'nl_BE')).toBe('/news/my-story');
    });
});

test.describe('applyBasePathAbsolute with a backend origin', () => {
    const config = {
        ...parseBasePathConfig({ THEME_BASE_PATH: '/presscentre' }),
        backendOrigin: 'https://x.prezly.com',
    };

    test('prefixes URLs on the newsroom origin', () => {
        expect(applyBasePathAbsolute('https://x.prezly.com/my-story', config, 'en')).toBe(
            'https://x.prezly.com/presscentre/my-story',
        );
    });

    test('leaves URLs of other newsrooms untouched', () => {
        expect(applyBasePathAbsolute('https://other.prezly.com/my-story', config, 'en')).toBe(
            'https://other.prezly.com/my-story',
        );
    });
});

test.describe('createToLocaleSlug', () => {
    test('leaves the short format to theme-kit', () => {
        expect(createToLocaleSlug('short')).toBeUndefined();
        expect(createToLocaleSlug(undefined)).toBeUndefined();
    });

    test('formats explicit slug formats', () => {
        expect(createToLocaleSlug('code')?.('nl_BE')).toBe('nl_BE');
        expect(createToLocaleSlug('iso-lower')?.('nl_BE')).toBe('nl-be');
    });
});

test.describe('resolveLocaleCode', () => {
    test('resolves any spelling of a full locale code', () => {
        for (const slug of ['nl_BE', 'nl-BE', 'nl-be', 'nl_be']) {
            expect(resolveLocaleCode(slug, ['fr_BE', 'nl_BE'])).toBe('nl_BE');
        }
    });

    test('does not guess for short slugs', () => {
        expect(resolveLocaleCode('nl', ['nl_BE', 'nl_NL'])).toBeUndefined();
    });
});
