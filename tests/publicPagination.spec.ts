import { expect, test } from '@playwright/test';
import { createPrezlyClient, Newsroom, type Story } from '@prezly/sdk';
import { ContentDelivery } from '@prezly/theme-kit-nextjs';
import { NextRequest } from 'next/server';

import {
    createGalleriesApiHandler,
    createHubStoriesApiHandler,
    createStoriesApiHandler,
} from '../src/adapters/server/public-list-api';
import {
    normalizeGalleryListParams,
    normalizeStoryListParams,
} from '../src/utils/normalizeListParams';
import { parsePublicListParams } from '../src/utils/publicPagination';

function fixture(total = 1500) {
    const calls = {
        adapters: 0,
        metadata: 0,
        members: 0,
        stories: [] as ContentDelivery.stories.SearchParams[],
        galleries: [] as ContentDelivery.galleries.SearchParams[],
        hub: [] as unknown[],
    };
    const client = createPrezlyClient({ accessToken: 'fixture-token' });
    client.newsroomHub.list = async () => {
        calls.members++;
        return [];
    };
    client.stories.search = async (params) => {
        calls.hub.push(params);
        return {
            stories: [],
            pagination: {
                matched_records_number: total,
                total_records_number: total,
                records_number: 0,
                offset: params?.offset ?? 0,
                limit: params?.limit ?? 20,
            },
            sort: '-published_at',
        };
    };
    const app = {
        client,
        stories: async (params: ContentDelivery.stories.SearchParams) => {
            calls.stories.push(params);
            return { stories: [] as Story[], pagination: { matched_records_number: total } };
        },
        galleries: async (params: ContentDelivery.galleries.SearchParams) => {
            calls.galleries.push(params);
            return { galleries: [], pagination: { matched_records_number: total } };
        },
        languages: async () => {
            calls.metadata++;
            return ['en', 'en_US', 'nl', 'sr_Latn_RS'].map((code) => ({
                locale: { code: code as 'en' },
            }));
        },
        categories: async () => {
            calls.metadata++;
            return [{ id: 1 }, { id: 7 }];
        },
    };
    const getApp = () => {
        calls.adapters++;
        return app;
    };
    return {
        calls,
        app,
        stories: createStoriesApiHandler(getApp),
        galleries: createGalleriesApiHandler(getApp),
        hub: createHubStoriesApiHandler(
            getApp,
            (headers) => headers.get('x-fixture-newsroom') ?? 'fixture-room',
        ),
    };
}

const request = (query = '') =>
    new NextRequest(`https://fixture.test/api/stories${query ? `?${query}` : ''}`);

for (const query of [
    'limit=1000',
    'limit=21',
    'limit=0',
    'limit=-1',
    'limit=12junk',
    'limit=1.5',
    'offset=-1',
    'offset=1e9',
    'offset=12junk',
    'offset=2147483648',
    'category=0',
    'category=7junk',
    'limit=12&limit=13',
    'offset=0&offset=0',
    'query=%7B%22status%22%3A%7B%22%24in%22%3A%5B%22draft%22%5D%7D%7D',
    'sort=created_at',
    'search=arbitrary',
    'unknown=value',
    'locale=en_US_extra_extra',
    `tag=${'x'.repeat(256)}`,
    'tag=%00',
]) {
    test(`rejects ${query} before adapter/cache/upstream work`, async () => {
        const f = fixture();
        const response = await f.stories(request(query));
        expect(response.status).toBe(400);
        expect(response.headers.get('cache-control')).toContain('no-store');
        expect(f.calls.adapters).toBe(0);
        expect(f.calls.stories).toHaveLength(0);
        expect(f.calls.metadata).toBe(0);
    });
}

test('defaults and equivalent scalars become the same effective input', () => {
    const parse = (query: string) => parsePublicListParams(new URLSearchParams(query), 'stories');
    expect(parse('')).toEqual(parse('limit=020&offset=000'));
    expect(parse('')).toEqual(parse('limit=&offset=&locale=&category=&tag='));
    expect(parse('locale=en-US')).toEqual(parse('locale=EN_us'));
    expect(parse('locale=sr-Latn-RS').locale).toBe('sr_Latn_RS');
    expect(parse('locale=en').locale).not.toBe(parse('locale=en_US').locale);
});

test('old loaded clients retain their bounded no-op exclusion without a different cache argument', async () => {
    const f = fixture();
    const query = new URLSearchParams({
        limit: '12',
        offset: '12',
        query: JSON.stringify({ uuid: { $nin: ['featured-story'] } }),
    });
    expect((await f.stories(request(query.toString()))).status).toBe(200);
    await f.stories(request('limit=12&offset=12'));
    expect(f.calls.stories[0]).toEqual(f.calls.stories[1]);
    for (const invalid of [
        { uuid: { $nin: ['one', 'two'] } },
        { uuid: { $regex: '.*' } },
        { status: 'draft' },
    ]) {
        expect(
            (
                await f.stories(
                    request(new URLSearchParams({ query: JSON.stringify(invalid) }).toString()),
                )
            ).status,
        ).toBe(400);
    }
});

test('ordinary homepage/category/tag load-more preserves effective filters and offsets', async () => {
    const f = fixture();
    for (const limit of [12, 13, 20]) {
        const response = await f.stories(
            request(`limit=${limit}&offset=26&locale=en-US&category=7&tag=release`),
        );
        expect(response.status).toBe(200);
        expect(f.calls.stories.at(-1)).toEqual({
            offset: 26,
            limit,
            locale: 'en_US',
            categories: [{ id: 7 }],
            tags: ['release'],
        });
    }
    expect(await (await f.stories(request())).json()).toEqual({ data: [], total: 1500 });
    expect(f.calls.stories.at(-1)?.locale).toBeUndefined();
});

test('unsupported real locale/category stops at cached metadata, never the content query', async () => {
    const f = fixture();
    expect((await f.stories(request('locale=zz_XX'))).status).toBe(400);
    expect((await f.stories(request('category=999'))).status).toBe(400);
    expect(f.calls.metadata).toBe(2);
    expect(f.calls.stories).toHaveLength(0);
});

for (const endpoint of ['stories', 'galleries', 'hub'] as const) {
    test(`${endpoint}: impossible deep offset reuses the first page and is not retained`, async () => {
        const f = fixture(1500);
        const response = await f[endpoint](request('limit=12&offset=1000000'));
        expect(await response.json()).toEqual({ data: [], total: 1500 });
        expect(response.headers.get('surrogate-control')).toBe('no-store');
        expect(response.headers.get('cache-control')).toContain('no-store');
        const calls = endpoint === 'hub' ? f.calls.hub : f.calls[endpoint];
        expect(calls).toHaveLength(1);
        expect(calls[0]).toMatchObject({ offset: 0, limit: 12 });
    });
    test(`${endpoint}: genuine deep archives remain reachable`, async () => {
        const f = fixture(50000);
        const response = await f[endpoint](request('limit=12&offset=20000'));
        expect(response.status).toBe(200);
        const calls = endpoint === 'hub' ? f.calls.hub : f.calls[endpoint];
        expect(calls.map((params) => (params as { offset: number }).offset)).toEqual([0, 20000]);
        if (endpoint === 'hub') expect(f.calls.members).toBe(1);
    });
}

test('gallery defaults and all ordinary page sizes remain bounded', async () => {
    const f = fixture();
    await f.galleries(request());
    expect(f.calls.galleries[0]).toEqual({ offset: 0, limit: 6 });
    await f.galleries(request('limit=6&offset=12'));
    expect(f.calls.galleries[1]).toEqual({ offset: 12, limit: 6 });
    expect((await f.galleries(request('locale=en'))).status).toBe(400);
    expect((await f.hub(request('category=7'))).status).toBe(400);
});

test('dependency failures propagate instead of becoming cacheable empty success', async () => {
    const f = fixture();
    f.app.stories = async () => {
        throw new Error('upstream failure');
    };
    await expect(f.stories(request('offset=1000'))).rejects.toThrow('upstream failure');
});

test('hub keeps published/public, locale, active-member and source restrictions', async () => {
    const f = fixture();
    f.app.client.newsroomHub.list = async () =>
        [
            {
                newsroom: { uuid: 'visible', status: Newsroom.Status.ACTIVE },
                is_displaying_stories_in_hub: true,
            },
            {
                newsroom: { uuid: 'hidden', status: Newsroom.Status.ACTIVE },
                is_displaying_stories_in_hub: false,
            },
            {
                newsroom: { uuid: 'offline', status: Newsroom.Status.INACTIVE },
                is_displaying_stories_in_hub: true,
            },
        ] as Awaited<ReturnType<typeof f.app.client.newsroomHub.list>>;
    const input = request('locale=nl&limit=12&offset=24');
    input.headers.set('x-fixture-newsroom', 'hub-source');
    await f.hub(input);
    expect(f.calls.hub[0]).toMatchObject({
        offset: 24,
        limit: 12,
        include: ['thumbnail_image'],
        query: {
            $and: [
                { locale: { $in: ['nl'] } },
                { status: { $in: ['published'] } },
                { visibility: { $in: ['public'] } },
                { 'newsroom.uuid': { $in: ['hub-source', 'visible'] } },
            ],
        },
    });
});

test('tag validation counts Unicode characters and preserves meaningful whitespace', () => {
    expect(
        parsePublicListParams(new URLSearchParams({ tag: '😀'.repeat(255) }), 'stories').tag,
    ).toBe('😀'.repeat(255));
    expect(parsePublicListParams(new URLSearchParams({ tag: ' release ' }), 'stories').tag).toBe(
        ' release ',
    );
});

test('public story projection keeps thumbnails and excludes management fields', async () => {
    const f = fixture(1);
    const story = {
        uuid: 'story',
        title: 'Title',
        slug: 'title',
        links: { newsroom_view: '/title' },
        newsroom: { uuid: 'room', url: 'https://fixture.test' },
        thumbnail_image: { uuid: 'thumbnail' },
        author: { email: 'private@example.test' },
    } as unknown as Story;
    f.app.stories = async (params) => {
        f.calls.stories.push(params);
        return { stories: [story], pagination: { matched_records_number: 1 } };
    };
    const body = await (await f.stories(request())).json();
    expect(body.data[0].thumbnail_image).toEqual({ uuid: 'thumbnail' });
    expect(body.data[0].newsroom).toEqual({ uuid: 'room', url: 'https://fixture.test' });
    expect(body.data[0].author).toBeUndefined();
});

test('normalization preserves genuine filter, locale, order, pagination and batch dimensions', () => {
    const params = {
        limit: 200,
        offset: 20000,
        locale: 'en_US' as const,
        categories: [{ id: 7 }],
        tags: ['b', 'a'],
        search: 'text',
        highlighted: 1,
        query: { uuid: { $nin: ['a'] } },
    };
    expect(normalizeStoryListParams(params)).toEqual(params);
    expect(normalizeGalleryListParams({ limit: 200, offset: 20000, type: 'image' })).toEqual({
        limit: 200,
        offset: 20000,
        type: 'image',
    });
});

test('real ContentDelivery uses one origin/cache entry for equivalent initial and load-more arguments', async () => {
    const category = { id: 7, name: 'Full category object', description: 'x'.repeat(500) };
    const variants = [
        { limit: 12, categories: [category], locale: { code: 'en' as const } },
        { offset: 0, locale: 'en' as const, categories: [{ id: 7 }], limit: 12 },
        { categories: [{ id: 7 }], locale: { code: 'en' as const }, limit: 12, highlighted: 0 },
    ];
    async function measure(normalize: boolean) {
        const entries = new Map<string, { value: unknown; version: number }>();
        const storage: ContentDelivery.Cache = {
            get<T>(key: string, version: number) {
                const entry = entries.get(key);
                return entry?.version === version ? (entry.value as T) : undefined;
            },
            set(key, value, version) {
                entries.set(key, { value, version });
            },
            namespace() {
                return this;
            },
        };
        let originCalls = 0;
        const client = createPrezlyClient({
            accessToken: 'fixture-token',
            fetch: async () => {
                originCalls++;
                return Response.json({
                    stories: [],
                    pagination: {
                        matched_records_number: 100,
                        records_number: 0,
                        total_records_number: 100,
                        offset: 0,
                        limit: 12,
                    },
                    sort: [],
                });
            },
        });
        const content = ContentDelivery.createClient(client, 'fixture-room', undefined, {
            cache: { storage, latestVersion: 1, scope: `fixture-${normalize}` },
        });
        for (const params of variants)
            await content.stories(normalize ? normalizeStoryListParams(params) : params);
        return {
            originCalls,
            records: entries.size,
            retainedBytes: [...entries].reduce(
                (sum, entry) => sum + Buffer.byteLength(JSON.stringify(entry)),
                0,
            ),
        };
    }
    const before = await measure(false);
    const after = await measure(true);
    expect(before.originCalls).toBe(3);
    expect(before.records).toBe(3);
    expect(after.originCalls).toBe(1);
    expect(after.records).toBe(1);
    expect(after.retainedBytes).toBeLessThan(before.retainedBytes);
    console.log('isolated canonicalization fixture', { before, after });
});

test('real cached reads do not alias locale, filters, pagination, source, authorization or version', async () => {
    const entries = new Map<string, { value: unknown; version: number }>();
    const storage: ContentDelivery.Cache = {
        get<T>(key: string, version: number) {
            const entry = entries.get(key);
            return entry?.version === version ? (entry.value as T) : undefined;
        },
        set(key, value, version) {
            entries.set(key, { value, version });
        },
        namespace() {
            return this;
        },
    };
    let calls = 0;
    function content(scope: string, version: number, total: number) {
        const client = createPrezlyClient({
            accessToken: `fixture-${scope}`,
            fetch: async () => {
                calls++;
                return Response.json({
                    stories: [],
                    pagination: {
                        matched_records_number: total,
                        records_number: 0,
                        total_records_number: total,
                        offset: 0,
                        limit: 12,
                    },
                    sort: '-published_at',
                });
            },
        });
        return ContentDelivery.createClient(client, 'fixture-room', undefined, {
            cache: { storage, latestVersion: version, scope },
        });
    }
    const first = content('source-a-auth-a', 1, 11);
    const base = { limit: 12, locale: 'en' as const };
    const variants: ContentDelivery.stories.SearchParams[] = [
        base,
        { ...base, locale: 'nl' },
        { ...base, categories: [{ id: 7 }] },
        { ...base, tags: ['tag'] },
        { ...base, offset: 12 },
        { ...base, limit: 13 },
        { ...base, query: { uuid: { $nin: ['story'] } } },
    ];
    for (const params of variants) await first.stories(normalizeStoryListParams(params));
    expect(calls).toBe(variants.length);
    await first.stories(normalizeStoryListParams(base));
    expect(calls).toBe(variants.length);
    expect(
        (await content('source-b-auth-a', 1, 22).stories(normalizeStoryListParams(base))).pagination
            .matched_records_number,
    ).toBe(22);
    expect(
        (await content('source-a-auth-b', 1, 33).stories(normalizeStoryListParams(base))).pagination
            .matched_records_number,
    ).toBe(33);
    expect(
        (await content('source-a-auth-a', 2, 44).stories(normalizeStoryListParams(base))).pagination
            .matched_records_number,
    ).toBe(44);
    expect(calls).toBe(variants.length + 3);
});
