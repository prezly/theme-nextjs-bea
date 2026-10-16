import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { runInThisContext } from 'node:vm';

import { expect, test } from '@playwright/test';
import { type ExtendedStory, Story } from '@prezly/sdk';
import { ContentDelivery, type Locale } from '@prezly/theme-kit-nextjs';
import { PrezlyAdapter } from '@prezly/theme-kit-nextjs/server';
import { Children, isValidElement, type ReactNode } from 'react';
import ts from 'typescript';

import { DEFAULT_THEME_SETTINGS } from '../src/theme-settings';
import { getRelatedStories } from '../src/utils/getRelatedStories';
import { isPossibleStorySlug } from '../src/utils/isPossibleStorySlug';
import { parsePreviewSearchParams } from '../src/utils/parsePreviewSearchParams';
import { sanitizeStories } from '../src/utils/sanitizeStory';

function story(uuid: string, isPinned = false): ExtendedStory {
    return {
        uuid,
        slug: `slug-${uuid}`,
        culture: { code: 'en' },
        visibility: Story.Visibility.PUBLIC,
        status: Story.Status.PUBLISHED,
        is_pinned: isPinned,
        categories: [],
        newsroom: { uuid: 'room', url: 'https://fixture.test' },
        links: { newsroom_view: `https://fixture.test/slug-${uuid}` },
        published_at: '2026-10-13T12:00:00Z',
        title: uuid,
        subtitle: '',
        oembed: { title: uuid },
        seo_settings: {},
    } as unknown as ExtendedStory;
}

const ids = (stories: Pick<Story, 'uuid'>[]) => stories.map(({ uuid }) => uuid);
const originalMode = process.env.PREZLY_MODE;
test.afterEach(() => {
    if (originalMode === undefined) delete process.env.PREZLY_MODE;
    else process.env.PREZLY_MODE = originalMode;
});

// Execute the actual async route exports while replacing their framework/UI
// boundaries. No browser or live API is needed to test when a list is requested.
const routes = {
    public: 'app/[localeCode]/(story)/[slug]/page.tsx',
    secret: 'app/[localeCode]/(story)/secret/[uuid]/page.tsx',
    preview: 'app/[localeCode]/(story)/preview/[uuid]/page.tsx',
};
type RouteKind = keyof typeof routes;
type Props = {
    params: Promise<{ localeCode: Locale.Code; slug: string; uuid: string }>;
    searchParams: Promise<Record<string, string>>;
};
type Route = {
    default: (props: Props) => Promise<ReactNode>;
    generateMetadata: (props: Props) => Promise<unknown>;
};
const StoryComponent = () => null;

function loadRoute(kind: RouteKind, modules: Record<string, unknown>): Route {
    const filename = resolve(__dirname, '..', routes[kind]);
    const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
        fileName: filename,
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            jsx: ts.JsxEmit.ReactJSX,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
        },
    });
    const nativeRequire = createRequire(filename);
    const module = { exports: {} };
    const evaluate = runInThisContext(`(function(require, module, exports) {${outputText}\n})`, {
        filename,
    });
    evaluate(
        (name: string) => (name in modules ? modules[name] : nativeRequire(name)),
        module,
        module.exports,
    );
    return module.exports as Route;
}

function renderedStory(node: ReactNode): {
    relatedStories: Story[];
    hasRelatedStories: boolean;
} {
    for (const child of Children.toArray(node)) {
        if (!isValidElement<{ children?: ReactNode }>(child)) continue;
        if (child.type === StoryComponent) return child.props as ReturnType<typeof renderedStory>;
        if (child.props.children) return renderedStory(child.props.children);
    }
    throw new Error('Story component not rendered');
}

function routeFixture(kind: RouteKind, showReadMore = true) {
    const calls = {
        lists: [] as ContentDelivery.stories.SearchParams[],
        previewLists: [] as ContentDelivery.stories.SearchParams[],
        lookups: [] as ContentDelivery.story.SearchParams[],
        previewConfigs: [] as { cache: boolean }[],
        settings: 0,
    };
    const current = story('current');
    const candidates = [current, story('second'), story('third'), story('fourth')];
    const app = {
        story: async (
            params: ContentDelivery.story.SearchParams,
        ): Promise<ExtendedStory | null> => {
            calls.lookups.push(params);
            return current;
        },
        stories: async (params: ContentDelivery.stories.SearchParams) => {
            calls.lists.push(params);
            return { stories: candidates };
        },
        themeSettings: async () => {
            calls.settings++;
            return { ...DEFAULT_THEME_SETTINGS, show_read_more: showReadMore };
        },
        newsroom: async () => ({ redirect_to_canonical_url: false }),
        companyInformation: async () => ({}),
    };
    const previewClient = {
        story: (params: ContentDelivery.story.SearchParams) => app.story(params),
        stories: async (params: ContentDelivery.stories.SearchParams) => {
            calls.previewLists.push(params);
            return { stories: candidates };
        },
    };
    const modules = {
        '@/adapters/server': {
            app: () => app,
            initPrezlyClient: (_headers: Headers, config: { cache: boolean }) => {
                calls.previewConfigs.push(config);
                return { contentDelivery: previewClient };
            },
            generateStoryPageMetadata: async (params: unknown) => params,
            configureAppRouter: () => ({ generate: () => '/canonical-story' }),
        },
        '@/utils': {
            getRelatedStories,
            parsePreviewSearchParams,
            sanitizeStories,
            isPossibleStorySlug,
            buildNewsArticleSchema: () => ({}),
        },
        'next/headers': { headers: async () => new Headers() },
        'next/navigation': {
            notFound: () => {
                throw new Error('not-found');
            },
            redirect: () => {
                throw new Error('redirect');
            },
            permanentRedirect: () => {
                throw new Error('permanent-redirect');
            },
        },
        '@/modules/Story': { Story: StoryComponent },
        '@/modules/Head': { JsonLd: () => null },
        '../components': { Broadcast: () => null },
        '../../components': { Broadcast: () => null },
    };
    const props = (searchParams: Record<string, string> = {}): Props => ({
        params: Promise.resolve({ localeCode: 'en', slug: current.slug, uuid: `${kind}-token` }),
        searchParams: Promise.resolve(searchParams),
    });
    return { route: loadRoute(kind, modules), calls, props, app, current };
}

for (const kind of Object.keys(routes) as RouteKind[]) {
    test(`${kind}: metadata resolves only the story, without settings or related lists`, async () => {
        const f = routeFixture(kind);
        expect(await f.route.generateMetadata(f.props())).toEqual({
            story: f.current,
            ...(kind === 'secret' ? { isSecret: true } : {}),
            ...(kind === 'preview' ? { isPreview: true } : {}),
        });
        expect(f.calls.lists).toEqual([]);
        expect(f.calls.previewLists).toEqual([]);
        expect(f.calls.settings).toBe(0);
        expect(f.calls.lookups).toEqual([
            kind === 'public' ? { slug: f.current.slug } : { uuid: `${kind}-token` },
        ]);
        if (kind === 'preview') expect(f.calls.previewConfigs).toEqual([{ cache: false }]);
    });

    test(`${kind}: disabled read-more renders without a related-list request`, async () => {
        const f = routeFixture(kind, false);
        expect(renderedStory(await f.route.default(f.props()))).toMatchObject({
            relatedStories: [],
            hasRelatedStories: false,
        });
        expect(f.calls.lists).toEqual([]);
        expect(f.calls.previewLists).toEqual([]);
    });

    test(`${kind}: enabled read-more uses four candidates and excludes the resolved UUID`, async () => {
        const f = routeFixture(kind);
        const props = f.props();
        props.params = props.params.then((params) => ({ ...params, localeCode: 'nl' }));
        const rendered = renderedStory(await f.route.default(props));
        expect(ids(rendered.relatedStories)).toEqual(['second', 'third', 'fourth']);
        expect(rendered.hasRelatedStories).toBe(true);
        expect(kind === 'preview' ? f.calls.previewLists : f.calls.lists).toEqual([
            { limit: 4, locale: 'nl' },
        ]);
        if (kind === 'preview') {
            expect(f.calls.lists).toEqual([]);
            expect(f.calls.previewConfigs).toEqual([{ cache: false }]);
        }
    });

    for (const enabled of [true, false]) {
        test(`${kind}: effective preview override ${enabled} decides whether to fetch`, async () => {
            process.env.PREZLY_MODE = 'preview';
            const f = routeFixture(kind, !enabled);
            const rendered = renderedStory(
                await f.route.default(f.props({ show_read_more: String(enabled) })),
            );
            expect(rendered.hasRelatedStories).toBe(enabled);
            expect(f.calls.lists.length + f.calls.previewLists.length).toBe(enabled ? 1 : 0);
        });
    }

    test(`${kind}: public mode ignores a query-string read-more override`, async () => {
        delete process.env.PREZLY_MODE;
        const f = routeFixture(kind, false);
        await f.route.default(f.props({ show_read_more: 'true' }));
        expect(f.calls.lists).toEqual([]);
        expect(f.calls.previewLists).toEqual([]);
    });

    test(`${kind}: missing stories do not trigger related-list work`, async () => {
        const f = routeFixture(kind);
        f.app.story = async () => null;
        await expect(f.route.generateMetadata(f.props())).rejects.toThrow('not-found');
        await expect(f.route.default(f.props())).rejects.toThrow('not-found');
        expect(f.calls.lists).toEqual([]);
        expect(f.calls.previewLists).toEqual([]);
    });
}

test('public metadata keeps canonical redirects ahead of related-list work', async () => {
    const f = routeFixture('public');
    f.current.seo_settings.canonical_url = 'https://canonical.test/story';
    f.app.newsroom = async () => ({ redirect_to_canonical_url: true });
    await expect(f.route.generateMetadata(f.props())).rejects.toThrow('permanent-redirect');
    expect(f.calls.lists).toEqual([]);
});

for (const current of ['pinned', 'second', 'third', 'fourth', 'outside']) {
    test(`current story ${current}: preserves pinned-first order and the three-card limit`, async () => {
        const candidates = [
            story('pinned', true),
            story('second'),
            story('third'),
            story('fourth'),
        ];
        const original = [...candidates];
        const result = await getRelatedStories(async () => ({ stories: candidates }), {
            story: story(current),
            locale: 'en',
            showReadMore: true,
        });
        expect(ids(result)).toEqual(
            ids(original)
                .filter((id) => id !== current)
                .slice(0, 3),
        );
        expect(candidates).toEqual(original);
        expect(result[0]).not.toHaveProperty('seo_settings');
    });
}

for (const candidates of [
    [],
    [story('current')],
    [story('current'), story('other')],
    [story('first'), story('second'), story('third')],
]) {
    test(`fewer candidates (${candidates.length}): returns only available other stories`, async () => {
        const result = await getRelatedStories(async () => ({ stories: candidates }), {
            story: story('current'),
            locale: 'en',
            showReadMore: true,
        });
        expect(ids(result)).toEqual(ids(candidates).filter((id) => id !== 'current'));
    });
}

function cacheFixture() {
    const namespace = `related-fixture-${randomUUID()}:`;
    const calls: Record<string, any>[] = [];
    let rows = [
        story('pinned', true),
        story('second'),
        story('third'),
        story('fourth'),
        story('fifth'),
    ];
    let fail = false;
    const fetch: typeof globalThis.fetch = async (_url, init) => {
        const params = JSON.parse(String(init?.body));
        calls.push(params);
        if (fail) throw new Error('fixture unavailable');
        // The old public-route query removes the current slug before taking three.
        const excluded = params.query.$and?.[0]?.slug?.$ne;
        const available = rows.filter(({ slug }) => slug !== excluded);
        return Response.json({
            stories: available.slice(params.offset, params.offset + params.limit),
            pagination: {
                matched_records_number: available.length,
                total_records_number: available.length,
                records_number: Math.min(params.limit, available.length),
                offset: params.offset,
                limit: params.limit,
            },
            sort: params.sort,
        });
    };
    function content({
        version = 1,
        newsroom = 'room',
        token = 'fixture-token',
        baseUrl = 'https://fixture.test',
        preview = false,
    } = {}) {
        return PrezlyAdapter.connect(
            { newsroom, accessToken: token, baseUrl, formats: [Story.FormatVersion.SLATEJS_V6] },
            {
                fetch,
                cache: preview
                    ? undefined
                    : {
                          memory: true,
                          latestVersion: version,
                          namespace,
                          requestScope: namespace,
                      },
            },
        ).usePrezlyClient().contentDelivery;
    }
    const list =
        (client: ContentDelivery.Client) => (params: ContentDelivery.stories.SearchParams) =>
            client.stories(params, { include: ['thumbnail_image'] });
    const related = (
        client: ContentDelivery.Client,
        current = 'outside',
        locale: Locale.Code = 'en',
    ) => getRelatedStories(list(client), { story: story(current), locale, showReadMore: true });
    return {
        content,
        related,
        calls,
        list,
        setRows: (value: ExtendedStory[]) => {
            rows = value;
        },
        setFail: (value: boolean) => {
            fail = value;
        },
    };
}

test('real SDK/cache fixture: five public story pages reuse one list instead of five', async () => {
    async function measure(reuse: boolean) {
        ContentDelivery.clearSharedMemoryCache();
        const f = cacheFixture();
        const result: string[][] = [];
        for (const current of ['pinned', 'second', 'third', 'fourth', 'outside']) {
            const client = f.content();
            if (reuse) result.push(ids(await f.related(client, current)));
            else
                result.push(
                    ids(
                        (
                            await client.stories(
                                {
                                    limit: 3,
                                    locale: 'en',
                                    query: JSON.stringify({ slug: { $ne: story(current).slug } }),
                                },
                                { include: ['thumbnail_image'] },
                            )
                        ).stories,
                    ),
                );
        }
        return {
            result,
            originCalls: f.calls.length,
            records: ContentDelivery.inspectSharedMemoryCache().records,
        };
    }
    const before = await measure(false);
    const after = await measure(true);
    expect(after.result).toEqual(before.result);
    expect(before.originCalls).toBe(5);
    expect(before.records).toBe(5);
    expect(after.originCalls).toBe(1);
    expect(after.records).toBe(1);
    console.log('isolated related-list fixture', { before, after });
});

test('SDK request keeps published/public, newsroom, locale, pinned/date ordering and thumbnails', async () => {
    const f = cacheFixture();
    await f.related(f.content(), 'outside', 'nl');
    expect(f.calls[0]).toMatchObject({
        limit: 4,
        offset: 0,
        sort: '-is_pinned,-published_at',
        include: 'thumbnail_image',
        query: {
            'newsroom.uuid': { $in: ['room'] },
            locale: { $in: ['nl'] },
            status: { $in: ['published'] },
            visibility: { $in: ['public'] },
        },
    });
    expect(f.calls[0].query).not.toHaveProperty('$and');
});

test('warm lists remain isolated by locale, newsroom, authorization and source', async () => {
    const f = cacheFixture();
    const variants = [
        { config: {}, locale: 'en' as const },
        { config: {}, locale: 'nl' as const },
        { config: { newsroom: 'another-room' }, locale: 'en' as const },
        { config: { token: 'another-token' }, locale: 'en' as const },
        { config: { baseUrl: 'https://another.fixture.test' }, locale: 'en' as const },
    ];
    for (const [index, { config, locale }] of variants.entries()) {
        f.setRows([story(`variant-${index}`)]);
        expect(ids(await f.related(f.content(config), 'outside', locale))).toEqual([
            `variant-${index}`,
        ]);
        f.setRows([story('must-not-replace-a-warm-result')]);
        expect(ids(await f.related(f.content(config), 'outside', locale))).toEqual([
            `variant-${index}`,
        ]);
        expect(f.calls).toHaveLength(index + 1);
    }
    expect(f.calls).toHaveLength(variants.length);
});

test('publication/version invalidation refreshes a warm list and shares the refreshed value', async () => {
    const f = cacheFixture();
    await f.related(f.content());
    f.setRows([story('newly-published', true), story('pinned', true)]);
    expect(ids(await f.related(f.content()))).toEqual(['pinned', 'second', 'third']);
    expect(ids(await f.related(f.content({ version: 2 })))).toEqual(['newly-published', 'pinned']);
    expect(ids(await f.related(f.content({ version: 2 }), 'newly-published'))).toEqual(['pinned']);
    expect(f.calls).toHaveLength(2);
});

test('uncached preview reads neither consume nor overwrite the warm public list', async () => {
    const f = cacheFixture();
    await f.related(f.content());
    f.setRows([story('latest-preview-data')]);
    for (let i = 0; i < 2; i++) {
        expect(ids(await f.related(f.content({ preview: true })))).toEqual(['latest-preview-data']);
    }
    expect(ids(await f.related(f.content()))).toEqual(['pinned', 'second', 'third']);
    expect(f.calls).toHaveLength(3);
});

test('related-list failures propagate without poisoning the reusable cache entry', async () => {
    const f = cacheFixture();
    f.setFail(true);
    await expect(f.related(f.content())).rejects.toThrow('fixture unavailable');
    f.setFail(false);
    expect(ids(await f.related(f.content()))).toEqual(['pinned', 'second', 'third']);
    expect(f.calls).toHaveLength(2);
});
