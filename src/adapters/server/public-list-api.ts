import { Newsroom, type NewsroomGallery, type PrezlyClient, SortOrder, Story } from '@prezly/sdk';
import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { sanitizeGalleries } from '../../utils/sanitizeGallery';
import { sanitizeStories } from '../../utils/sanitizeStory';
import {
    DEEP_OFFSET_THRESHOLD,
    parsePublicListParams,
    PublicListInputError,
    type PublicListKind,
    type PublicListParams,
} from '../../utils/publicPagination';

interface ApiApp {
    stories(params: ContentDelivery.stories.SearchParams): Promise<{
        stories: Story[];
        pagination: { matched_records_number: number };
    }>;
    galleries(params: ContentDelivery.galleries.SearchParams): Promise<{
        galleries: NewsroomGallery[];
        pagination: { matched_records_number: number };
    }>;
    languages(): Promise<{ locale: { code: Locale.Code } }[]>;
    categories(): Promise<{ id: number }[]>;
    client: Pick<PrezlyClient, 'newsroomHub' | 'stories'>;
}

type Page = { data: unknown[]; total: number };
type Reader = (offset: number) => Promise<Page>;
type CreateReader = (
    app: ApiApp,
    params: PublicListParams,
    request: NextRequest,
) => Reader | Promise<Reader>;

export function createStoriesApiHandler(getApp: () => ApiApp) {
    return createHandler('stories', getApp, (app, params) => async (offset) => {
        const { stories, pagination } = await app.stories({
            offset,
            limit: params.limit,
            locale: params.locale,
            categories: params.category ? [{ id: params.category }] : undefined,
            tags: params.tag ? [params.tag] : undefined,
        });
        return { data: sanitizeStories(stories), total: pagination.matched_records_number };
    });
}

export function createGalleriesApiHandler(getApp: () => ApiApp) {
    return createHandler('galleries', getApp, (app, params) => async (offset) => {
        const { galleries, pagination } = await app.galleries({ offset, limit: params.limit });
        return { data: sanitizeGalleries(galleries), total: pagination.matched_records_number };
    });
}

export function createHubStoriesApiHandler(
    getApp: () => ApiApp,
    getNewsroomUuid: (headers: Headers) => string,
) {
    return createHandler('hub-stories', getApp, async (app, params, request) => {
        const uuid = getNewsroomUuid(request.headers);
        const members = await app.client.newsroomHub.list(uuid);
        const included = members.filter(
            (member) => Newsroom.isActive(member.newsroom) && member.is_displaying_stories_in_hub,
        );
        return async (offset) => {
            const { stories, pagination } = await app.client.stories.search({
                offset,
                limit: params.limit,
                include: ['thumbnail_image'],
                sortOrder: SortOrder.desc('published_at'),
                query: {
                    $and: [
                        { locale: { $in: [params.locale ?? null] } },
                        { status: { $in: [Story.Status.PUBLISHED] } },
                        { visibility: { $in: [Story.Visibility.PUBLIC] } },
                        {
                            'newsroom.uuid': {
                                $in: [uuid, ...included.map(({ newsroom }) => newsroom.uuid)],
                            },
                        },
                    ],
                },
            });
            return { data: sanitizeStories(stories), total: pagination.matched_records_number };
        };
    });
}

function createHandler(kind: PublicListKind, getApp: () => ApiApp, createReader: CreateReader) {
    return async (request: NextRequest) => {
        try {
            // Validate syntax and supported inputs before resolving an adapter or cache.
            const params = parsePublicListParams(request.nextUrl.searchParams, kind);
            const app = getApp();
            const [languages, categories] = await Promise.all([
                params.locale ? app.languages() : Promise.resolve([]),
                params.category ? app.categories() : Promise.resolve([]),
            ]);
            if (params.locale && !languages.some(({ locale }) => locale.code === params.locale)) {
                throw new PublicListInputError('Unsupported newsroom locale.');
            }
            if (params.category && !categories.some(({ id }) => id === params.category)) {
                throw new PublicListInputError('Unsupported newsroom category.');
            }
            const read = await createReader(app, params, request);
            if (params.offset >= DEEP_OFFSET_THRESHOLD) {
                // Reuse the bounded first page and its matching count. Preserve real
                // deep archives, but never fetch/store a separate impossible offset.
                const first = await read(0);
                if (params.offset >= first.total) {
                    return NextResponse.json(
                        { data: [], total: first.total },
                        { headers: noStoreHeaders() },
                    );
                }
            }
            return NextResponse.json(await read(params.offset));
        } catch (error) {
            if (!(error instanceof PublicListInputError)) throw error;
            return NextResponse.json(
                { error: error.message },
                { status: 400, headers: noStoreHeaders() },
            );
        }
    };
}

function noStoreHeaders() {
    // The legacy Varnish success override removes Cache-Control. Its built-in
    // policy still honors Surrogate-Control, preventing empty-probe variants.
    return { 'Cache-Control': 'private, no-store', 'Surrogate-Control': 'no-store' };
}
