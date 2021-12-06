import PrezlySDK, {
    Category,
    ExtraStoryFields,
    Newsroom,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk';

import { BasePageProps } from 'types';

import { DEFAULT_PAGE_SIZE } from '../constants';

import {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageFromLocaleSlug,
    getLanguageFromStory,
    getShortestLocaleCode,
} from './languages';
import {
    getGalleriesQuery,
    getSlugQuery,
    getSortByPublishedDate,
    getStoriesQuery,
} from './queries';

const DEFAULT_SORT_ORDER: SortOrder = 'desc';

type SortOrder = 'desc' | 'asc';

interface GetStoriesOptions {
    page?: number;
    pageSize?: number;
    order?: SortOrder;
    include?: (keyof ExtraStoryFields)[];
    localeCode?: string;
}

interface GetGalleriesOptions {
    page?: number;
    pageSize: number;
}

export default class PrezlyApi {
    private readonly sdk: PrezlySDK;

    private readonly newsroomUuid: Newsroom['uuid'];

    constructor(accessToken: string, newsroomUuid: Newsroom['uuid']) {
        this.sdk = new PrezlySDK({ accessToken });
        this.newsroomUuid = newsroomUuid;
    }

    getStory(uuid: string) {
        return this.sdk.stories.get(uuid);
    }

    async getNewsroom() {
        return this.sdk.newsrooms.get(this.newsroomUuid);
    }

    async getNewsroomLanguages(): Promise<NewsroomLanguageSettings[]> {
        return (await this.sdk.newsroomLanguages.list(this.newsroomUuid)).languages;
    }

    async getAllStories(order: SortOrder = DEFAULT_SORT_ORDER) {
        const sortOrder = getSortByPublishedDate(order);
        const newsroom = await this.getNewsroom();
        const jsonQuery = JSON.stringify(getStoriesQuery(newsroom.uuid));
        const maxStories = newsroom.stories_number;
        const chunkSize = 200;

        const pages = Math.ceil(maxStories / chunkSize);
        const storiesPromises = Array.from({ length: pages }, (_, pageIndex) =>
            this.searchStories({
                limit: chunkSize,
                sortOrder,
                jsonQuery,
                offset: pageIndex * chunkSize,
            }),
        );

        const stories = (await Promise.all(storiesPromises)).flatMap(
            (response) => response.stories,
        );

        return stories;
    }

    async getStories({
        page = undefined,
        pageSize = DEFAULT_PAGE_SIZE,
        order = DEFAULT_SORT_ORDER,
        include,
        localeCode,
    }: GetStoriesOptions = {}) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery(this.newsroomUuid, undefined, localeCode));

        const { stories, pagination } = await this.searchStories({
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            sortOrder,
            jsonQuery,
            include,
        });

        const storiesTotal = pagination.matched_records_number;

        return { stories, storiesTotal };
    }

    async getStoriesFromCategory(
        category: Category,
        {
            page = undefined,
            pageSize = DEFAULT_PAGE_SIZE,
            order = DEFAULT_SORT_ORDER,
            include,
            localeCode,
        }: GetStoriesOptions = {},
    ) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(
            getStoriesQuery(this.newsroomUuid, category.id, localeCode),
        );

        const { stories, pagination } = await this.searchStories({
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            sortOrder,
            jsonQuery,
            include,
        });

        const storiesTotal = pagination.matched_records_number;

        return { stories, storiesTotal };
    }

    async getStoryBySlug(slug: string) {
        const jsonQuery = JSON.stringify(getSlugQuery(slug));
        const { stories } = await this.searchStories({
            limit: 1,
            jsonQuery,
        });

        if (stories[0]) {
            return this.getStory(stories[0].uuid);
        }

        return null;
    }

    async getCategories(): Promise<Category[]> {
        const categories = await this.sdk.newsroomCategories.list(this.newsroomUuid);

        return Array.isArray(categories) ? categories : Object.values(categories);
    }

    async getCategoryBySlug(slug: string) {
        const categories = await this.getCategories();

        return categories.find((category) =>
            Object.values(category.i18n).some((t) => t.slug === slug),
        );
    }

    searchStories: typeof PrezlySDK.prototype.stories.search = (options) =>
        this.sdk.stories.search(options);

    async getGalleries({ page = undefined, pageSize }: GetGalleriesOptions) {
        return this.sdk.newsroomGalleries.list(this.newsroomUuid, {
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            scope: getGalleriesQuery(),
        });
    }

    async getGallery(uuid: string) {
        return this.sdk.newsroomGalleries.get(this.newsroomUuid, uuid);
    }

    async getBasePageProps(nextLocaleIsoCode?: string, story?: Story): Promise<BasePageProps> {
        const [newsroom, languages, categories] = await Promise.all([
            this.getNewsroom(),
            this.getNewsroomLanguages(),
            this.getCategories(),
        ]);

        const currentLanguage = story
            ? getLanguageFromStory(languages, story)
            : getLanguageFromLocaleSlug(languages, nextLocaleIsoCode);
        const defaultLanguage = getDefaultLanguage(languages);

        const { code: localeCode } = currentLanguage || defaultLanguage;
        const shortestLocaleCode = getShortestLocaleCode(languages, localeCode);

        // TODO: if no information given for current language, show boilerplate from default language
        const companyInformation = getCompanyInformation(languages, localeCode);

        return {
            newsroom,
            companyInformation,
            categories,
            languages,
            localeCode,
            shortestLocaleCode,
            localeResolved: Boolean(currentLanguage),
        };
    }
}
