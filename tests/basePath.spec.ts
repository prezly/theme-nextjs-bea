import { expect, test } from '@playwright/test';

import {
    applyBasePath,
    applyBasePathAbsolute,
    parseBasePathConfig,
    stripBasePath,
} from '../src/utils/basePath';

/**
 * Pure-logic unit tests for the reverse-proxy path helpers. No browser/server
 * needed — these exercise `applyBasePath` (outbound URL generation) and
 * `stripBasePath` (inbound middleware normalization) and their round-trip.
 */

// AB InBev: same subdir for every locale, full locale code in the path.
const abinbev = parseBasePathConfig({
    THEME_LOCALE_SUBDIR: '*:news',
    THEME_LOCALE_SLUG_FORMAT: 'code',
});
// Short mode: subdir configured, no slug format (e.g. an earlier ali-newsroom setup).
const short = parseBasePathConfig({ THEME_LOCALE_SUBDIR: '*:news' });
// Stock: no reverse-proxy config at all — paths must stay unchanged.
const stock = parseBasePathConfig({});

test.describe('applyBasePath (outbound)', () => {
    test('AB InBev — story routes get locale + subdir prefix (incl. default locale)', () => {
        expect(applyBasePath('/my-story', abinbev, 'fr_BE')).toBe('/fr_BE/news/my-story');
        expect(applyBasePath('/my-story', abinbev, 'nl_BE')).toBe('/nl_BE/news/my-story');
    });

    test('AB InBev — locale-aware routes keep their locale, gain the subdir', () => {
        expect(applyBasePath('/fr_BE/category/x', abinbev, 'fr_BE')).toBe('/fr_BE/news/category/x');
        expect(applyBasePath('/nl_BE/search', abinbev, 'nl_BE')).toBe('/nl_BE/news/search');
        expect(applyBasePath('/fr_BE', abinbev, 'fr_BE')).toBe('/fr_BE/news');
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
    test('AB InBev — prefixes the path and keeps the origin and query', () => {
        expect(applyBasePathAbsolute('https://x.prezly.com/my-story?a=1', abinbev, 'nl_BE')).toBe(
            'https://x.prezly.com/nl_BE/news/my-story?a=1',
        );
    });

    test('stock — returns the URL untouched, without normalizing it', () => {
        expect(applyBasePathAbsolute('https://x.prezly.com', stock, 'fr_BE')).toBe(
            'https://x.prezly.com',
        );
    });
});

test.describe('stripBasePath (inbound)', () => {
    test('AB InBev — story routes drop both locale and subdir', () => {
        // /:slug pattern has no locale segment; resolveLocale recovers it from the slug.
        expect(stripBasePath('/fr_BE/news/my-story', abinbev)).toBe('/my-story');
        expect(stripBasePath('/nl_BE/news/my-story', abinbev)).toBe('/my-story');
        expect(stripBasePath('/fr_BE/news/s/uuid', abinbev)).toBe('/s/uuid');
    });

    test('AB InBev — locale-aware routes keep the locale, drop the subdir', () => {
        expect(stripBasePath('/fr_BE/news/category/x', abinbev)).toBe('/fr_BE/category/x');
        expect(stripBasePath('/nl_BE/news/search', abinbev)).toBe('/nl_BE/search');
        expect(stripBasePath('/fr_BE/news', abinbev)).toBe('/fr_BE');
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
            const emitted = applyBasePath(route, abinbev, locale);
            expect(stripBasePath(emitted, abinbev)).toBe(routable);
        });
    }
});
