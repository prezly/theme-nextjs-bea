import { expect, test } from '@playwright/test';

import { buildNewsArticleSchema, buildOrganizationSchema } from '../src/utils/structuredData';

/**
 * The JSON-LD builders take their URLs from backend-owned values (`newsroom.url`,
 * `story.oembed.url`) which carry neither `THEME_BASE_PATH` nor
 * `THEME_LOCALE_SUBDIR`. Behind a reverse proxy those point at paths that don't
 * exist, so callers may pass proxy-correct overrides. These tests pin the
 * precedence — and pin that omitting the overrides keeps the backend URLs.
 */

const newsroom = {
    name: 'Newsroom',
    url: 'https://www.example.com',
    newsroom_logo: null,
} as unknown as Parameters<typeof buildOrganizationSchema>[0]['newsroom'];

const companyInformation = {
    name: 'Example',
    about_plaintext: '',
    seo_settings: { meta_description: null, default_meta_description: null },
} as unknown as Parameters<typeof buildOrganizationSchema>[0]['companyInformation'];

function story(canonicalUrl: string | null) {
    return {
        slug: 'my-story',
        title: 'My story',
        subtitle: null,
        summary: null,
        updated_at: '2026-08-01T00:00:00Z',
        published_at: '2026-08-01T00:00:00Z',
        author: null,
        culture: { code: 'nl_BE' },
        oembed: { url: 'https://www.example.com/my-story' },
        seo_settings: {
            canonical_url: canonicalUrl,
            meta_title: null,
            default_meta_title: null,
            meta_description: null,
            default_meta_description: null,
        },
    } as unknown as Parameters<typeof buildNewsArticleSchema>[0]['story'];
}

test.describe('buildOrganizationSchema', () => {
    test('falls back to newsroom.url when no override is given (stock Bea)', () => {
        const schema = buildOrganizationSchema({ newsroom, companyInformation });
        expect(schema.url).toBe('https://www.example.com');
    });

    test('uses the proxy-correct newsroom URL when given', () => {
        const schema = buildOrganizationSchema({
            newsroom,
            companyInformation,
            newsroomUrl: 'https://www.example.com/nl_BE/news',
        });
        expect(schema.url).toBe('https://www.example.com/nl_BE/news');
    });
});

test.describe('buildNewsArticleSchema', () => {
    test('falls back to oembed.url when no override is given (stock Bea)', () => {
        const schema = buildNewsArticleSchema({
            story: story(null),
            newsroom,
            companyInformation,
        });
        expect(schema.url).toBe('https://www.example.com/my-story');
        expect(schema.mainEntityOfPage).toMatchObject({ '@id': 'https://www.example.com/my-story' });
    });

    test('prefers the proxy-correct story URL over oembed.url', () => {
        const schema = buildNewsArticleSchema({
            story: story(null),
            newsroom,
            companyInformation,
            storyUrl: 'https://www.example.com/nl_BE/news/my-story',
        });
        expect(schema.url).toBe('https://www.example.com/nl_BE/news/my-story');
        expect(schema.mainEntityOfPage).toMatchObject({
            '@id': 'https://www.example.com/nl_BE/news/my-story',
        });
    });

    test('an explicit backend canonical always wins', () => {
        const schema = buildNewsArticleSchema({
            story: story('https://canonical.example.org/elsewhere'),
            newsroom,
            companyInformation,
            storyUrl: 'https://www.example.com/nl_BE/news/my-story',
        });
        expect(schema.url).toBe('https://canonical.example.org/elsewhere');
    });

    test('the publisher block picks up the proxy-correct newsroom URL', () => {
        const schema = buildNewsArticleSchema({
            story: story(null),
            newsroom,
            companyInformation,
            newsroomUrl: 'https://www.example.com/nl_BE/news',
        });
        expect(schema.publisher).toMatchObject({ url: 'https://www.example.com/nl_BE/news' });
    });
});
