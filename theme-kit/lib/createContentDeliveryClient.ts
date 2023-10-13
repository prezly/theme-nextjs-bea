/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Category, Culture, Newsroom, PrezlyClient } from '@prezly/sdk';
import { ApiError, NewsroomGallery, SortOrder, Stories, Story } from '@prezly/sdk';

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
        pageSize: defaultPageSize = DEFAULT_PAGE_SIZE,
    }: Params = {},
) {
    const contentDeliveryClient = {
        newsroom() {
            return prezly.newsrooms.get(newsroomUuid);
        },

        languages() {
            return prezly.newsroomLanguages.list(newsroomUuid).then((data) => data.languages);
        },

        async language(code?: Culture['code']) {
            const languages = await contentDeliveryClient.languages();

            return languages.find(
                (lang) => (!code && lang.is_default) || lang.locale.code === code,
            );
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

        async gallery(uuid: NewsroomGallery['uuid']) {
            try {
                return await prezly.newsroomGalleries.get(newsroomUuid, uuid);
            } catch (error) {
                if (error instanceof ApiError && isNotAvailableError(error)) {
                    return null;
                }
                throw error;
            }
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
                pageSize: params.pageSize ?? defaultPageSize,
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

        async story(
            params: { uuid: Story['uuid']; slug?: never } | { uuid?: never; slug: Story['slug'] },
        ) {
            if (params.uuid) {
                try {
                    return await prezly.stories.get(params.uuid, {
                        formats,
                        include: Stories.EXTENDED_STORY_INCLUDED_EXTRA_FIELDS,
                    });
                } catch (error) {
                    if (error instanceof ApiError && isNotAvailableError(error)) {
                        return null;
                    }

                    throw error;
                }
            }

            const { stories } = await prezly.stories.search({
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

            return stories[0] ?? null;
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

const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_FORBIDDEN = 403;
const ERROR_CODE_GONE = 410;

function isNotAvailableError(error: ApiError) {
    return (
        error.status === ERROR_CODE_NOT_FOUND ||
        error.status === ERROR_CODE_GONE ||
        error.status === ERROR_CODE_FORBIDDEN
    );
}
