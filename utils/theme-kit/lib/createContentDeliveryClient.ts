/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Category, Culture, Newsroom, PrezlyClient } from '@prezly/sdk';
import { NewsroomGallery, SortOrder, Stories, Story } from '@prezly/sdk';

const DEFAULT_PAGE_SIZE = 20;

interface Params {
    formats?: Story.FormatVersion[];
    pinning?: boolean;
    pageSize?: number;
}

export function createContentDeliveryClient(
    prezly: PrezlyClient,
    newsroomUuid: Newsroom['uuid'],
    {
        formats = [Story.FormatVersion.SLATEJS_V4],
        pinning = false,
        pageSize = DEFAULT_PAGE_SIZE,
    }: Params = {},
) {
    const contentDeliveryClient = {
        newsroom() {
            return prezly.newsrooms.get(newsroomUuid);
        },
        languages() {
            return prezly.newsroomLanguages.list(newsroomUuid).then((data) => data.languages);
        },
        categories() {
            return prezly.newsroomCategories.list(newsroomUuid, {
                sortOrder: '+order',
            });
        },
        async category(slug: Category['i18n'][string]['slug']) {
            const categories = await contentDeliveryClient.categories();
            return categories.find((category) =>
                Object.values(category.i18n).some((t) => t.slug === slug),
            );
        },
        featuredContacts() {
            return prezly.newsroomContacts.search(newsroomUuid, {
                query: {
                    is_featured: true,
                },
            });
        },
        galleries(params: { page?: number; pageSize?: number; type?: `${NewsroomGallery.Type}` }) {
            const { page, pageSize, type } = params;
            const { limit, offset } = toPaginationParams({ page, pageSize });
            return prezly.newsroomGalleries.search(newsroomUuid, {
                limit,
                offset,
                scope: {
                    status: NewsroomGallery.Status.PUBLIC,
                    is_empty: false,
                    type,
                },
            });
        },
        gallery(uuid: NewsroomGallery['uuid']) {
            return prezly.newsroomGalleries.get(newsroomUuid, uuid);
        },
        stories(params: {
            search?: string;
            category?: Pick<Category, 'id'>;
            locale?: Pick<Culture, 'code'>;
            page?: number;
            pageSize?: number;
            withFeaturedItems?: number;
        }) {
            const { limit, offset } = toPaginationParams({
                page: params.page,
                pageSize: params.pageSize ?? pageSize,
            });
            return prezly.stories.search({
                sortOrder: chronologically(SortOrder.Direction.DESC, pinning),
                formats,
                limit,
                offset,
                search: params.search,
                query: {
                    'newsroom.uuid': { $in: [newsroomUuid] },
                    'category.id': params.category ? { $any: [params.category.id] } : undefined,
                    locale: params.locale ? { $in: [params.locale.code] } : undefined,
                    status: { $in: [Story.Status.PUBLISHED] },
                    visibility: { $in: [Story.Visibility.PUBLIC] },
                },
            });
        },
        story(
            params: { uuid: Story['uuid']; slug?: never } | { uuid?: never; slug: Story['slug'] },
        ) {
            if (params.uuid) {
                return prezly.stories.get(params.uuid, {
                    formats,
                    include: Stories.EXTENDED_STORY_INCLUDED_EXTRA_FIELDS,
                });
            }
            return prezly.stories.search({
                formats,
                limit: 1,
                query: {
                    slug: params.slug,
                    'newsroom.uuid': { $in: [newsroomUuid] },
                    status: {
                        $in: [Story.Status.PUBLISHED, Story.Status.EMBARGO],
                    },
                    visibility: {
                        $in: [
                            Story.Visibility.PUBLIC,
                            Story.Visibility.PRIVATE,
                            Story.Visibility.EMBARGO,
                        ],
                    },
                },
                include: Stories.EXTENDED_STORY_INCLUDED_EXTRA_FIELDS,
            });
        },
    };

    return contentDeliveryClient;
}

function chronologically(direction: `${SortOrder.Direction}`, pinning = false) {
    const pinnedFirst = SortOrder.desc('is_pinned');
    const chronological =
        direction === SortOrder.Direction.ASC
            ? SortOrder.asc('published_at')
            : SortOrder.desc('published_at');

    return pinning ? SortOrder.combine(pinnedFirst, chronological) : chronological;
}

function toPaginationParams(params: {
    page?: number;
    pageSize?: number;
    withFeaturedItems?: number;
}) {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE, withFeaturedItems = 0 } = params;

    if (pageSize <= 0) {
        throw new Error('Page size must be a positive integer number.');
    }

    if (page <= 0) {
        throw new Error('Page number must be a positive integer number.');
    }

    const offset = pageSize * (page - 1);
    const limit = pageSize;

    if (page === 1) {
        return { offset: 0, limit: limit + withFeaturedItems };
    }

    return { offset: offset + withFeaturedItems, limit };
}
