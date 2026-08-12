import { Sitemap } from '@prezly/theme-kit-nextjs';
import type { Story } from '@prezly/sdk';
import { headers } from 'next/headers';

import { app, environment, routing } from '@/adapters/server';

const STORY_API_PAGE_SIZE = 200;
// Theme Kit retains Redis cache hits in its request-deduplication map. Keep each
// sitemap response small enough that those retained pages cannot exhaust the heap.
const SITEMAP_STORY_PAGE_SIZE = 500;

export async function buildSitemapIndexXml(): Promise<string | null> {
    const appHelper = app();
    const [baseUrl, firstStory] = await Promise.all([
        retrieveBaseUrl(),
        appHelper.sitemapStories({ limit: 1, offset: 0 }),
    ]);
    const pageCount = Math.max(
        1,
        Math.ceil(firstStory.pagination.matched_records_number / SITEMAP_STORY_PAGE_SIZE),
    );

    if (pageCount === 1) {
        return null;
    }

    const urls = Array.from({ length: pageCount }, (_, page) => {
        const url = new URL('/sitemap.xml', baseUrl);
        url.searchParams.set('page', String(page));
        return url.toString();
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <sitemap><loc>${escapeXml(url)}</loc></sitemap>`).join('\n')}
</sitemapindex>`;
}

export async function buildSitemapPage(page: number): Promise<Sitemap.SitemapFile | null> {
    if (!Number.isSafeInteger(page) || page < 0) {
        return null;
    }

    const appHelper = app();
    const offset = page * SITEMAP_STORY_PAGE_SIZE;
    const [{ generateUrl }, baseUrl, locales, firstStoryPage] = await Promise.all([
        routing(),
        retrieveBaseUrl(),
        appHelper.locales(),
        appHelper.sitemapStories({ limit: STORY_API_PAGE_SIZE, offset }),
    ]);
    const totalStories = firstStoryPage.pagination.matched_records_number;

    if (offset >= totalStories && page !== 0) {
        return null;
    }

    const endOffset = Math.min(offset + SITEMAP_STORY_PAGE_SIZE, totalStories);
    const remainingPageRequests = [];
    for (
        let pageOffset = offset + STORY_API_PAGE_SIZE;
        pageOffset < endOffset;
        pageOffset += STORY_API_PAGE_SIZE
    ) {
        remainingPageRequests.push(
            appHelper.sitemapStories({
                limit: Math.min(STORY_API_PAGE_SIZE, endOffset - pageOffset),
                offset: pageOffset,
            }),
        );
    }

    const staticEntriesPromise =
        page === 0
            ? Promise.all([appHelper.newsroom(), appHelper.categories()]).then(
                  ([newsroom, categories]) =>
                      Sitemap.generate(
                          {
                              generateUrl,
                              categories,
                              newsroom,
                              locales,
                              stories: [],
                          },
                          { baseUrl },
                      ),
              )
            : Promise.resolve([]);

    const [remainingPages, staticEntries] = await Promise.all([
        Promise.all(remainingPageRequests),
        staticEntriesPromise,
    ]);

    const storyEntries: Sitemap.SitemapFile = [];
    const activeLocales = new Set(locales);
    appendStoryEntries(storyEntries, firstStoryPage.stories, activeLocales, generateUrl);
    for (const storyPage of remainingPages) {
        appendStoryEntries(storyEntries, storyPage.stories, activeLocales, generateUrl);
    }

    const absoluteStoryEntries = await Sitemap.build(storyEntries, { baseUrl });

    return [...staticEntries, ...absoluteStoryEntries];
}

function appendStoryEntries(
    entries: Sitemap.SitemapFile,
    stories: Story[],
    activeLocales: Set<Story['culture']['code']>,
    generateUrl: Sitemap.AppUrlGenerator,
) {
    for (const story of stories) {
        if (!activeLocales.has(story.culture.code)) {
            continue;
        }

        const url = generateUrl('story', {
            ...story,
            localeCode: story.culture.code,
        });
        if (!url) {
            continue;
        }

        entries.push({
            url,
            lastModified: story.updated_at,
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    }
}

export async function retrieveBaseUrl() {
    const { NEXT_PUBLIC_BASE_URL } = environment();

    const appHeaders = await headers();

    return NEXT_PUBLIC_BASE_URL ?? `https://${appHeaders.get('host')}`;
}

function escapeXml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
