import PrezlySDK, {
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
} from '@prezly/sdk';
import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { getSlugQuery, getSortByPublishedDate, getStoriesQuery } from './queries';

const DEFAULT_SORT_ORDER: SortOrder = 'desc';

type SortOrder = 'desc' | 'asc';

interface GetStoriesOptions {
    page?: number;
    pageSize?: number;
    order?: SortOrder;
}

export default class PrezlyApi {
    private readonly sdk: PrezlySDK;

    private readonly newsroomUuid: Newsroom['uuid'];

    constructor(accessToken: string, newsroomUuid: Newsroom['uuid']) {
        this.sdk = new PrezlySDK({ accessToken });
        this.newsroomUuid = newsroomUuid;
    }

    getStory(id: number) {
        return this.sdk.stories.get(id);
    }

    async getNewsroom() {
        return this.sdk.newsrooms.get(this.newsroomUuid);
    }

    async getNewsroomLanguages(): Promise<NewsroomLanguageSettings[]> {
        return (await this.sdk.newsroomLanguages.list(this.newsroomUuid)).languages;
    }

    async getNewsroomDefaultLanguage(): Promise<NewsroomLanguageSettings> {
        const languages = await this.getNewsroomLanguages();

        return languages.find(({ is_default }) => !!is_default) || languages[0];
    }

    async getCompanyInformation(): Promise<NewsroomCompanyInformation> {
        const languageSettings = await this.getNewsroomDefaultLanguage();

        return languageSettings!.company_information;
    }

    async getAllStories(order: SortOrder = DEFAULT_SORT_ORDER) {
        const sortOrder = getSortByPublishedDate(order);
        const newsroom = await this.getNewsroom();
        const jsonQuery = JSON.stringify(getStoriesQuery(newsroom.uuid));
        const maxStories = newsroom.stories_number;
        const chunkSize = 200;

        const pages = Math.ceil(maxStories / chunkSize);
        const storiesPromises = Array.from({ length: pages }, (_, pageIndex) => this.searchStories({
            limit: chunkSize,
            sortOrder,
            jsonQuery,
            offset: pageIndex * chunkSize,
        }));

        const stories = (await Promise.all(storiesPromises)).flatMap(
            (response) => response.stories,
        );

        return stories;
    }

    async getStories({
        page = undefined,
        pageSize = DEFAULT_PAGE_SIZE,
        order = DEFAULT_SORT_ORDER,
    }: GetStoriesOptions = {}) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery(this.newsroomUuid));

        const { stories, pagination } = await this.searchStories({
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            sortOrder,
            jsonQuery,
        });

        const storiesTotal = pagination.matched_records_number;

        return { stories, storiesTotal };
    }

    async getStoriesExtended(options?: GetStoriesOptions) {
        const { stories } = await this.getStories(options);
        const extendedStoriesPromises = stories.map((story) => this.getStory(story.id));

        return Promise.all(extendedStoriesPromises);
    }

    async getStoriesFromCategory(
        category: Category,
        {
            page = undefined,
            pageSize = DEFAULT_PAGE_SIZE,
            order = DEFAULT_SORT_ORDER,
        }: GetStoriesOptions = {},
    ) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery(this.newsroomUuid, category.id));

        const { stories, pagination } = await this.searchStories({
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            sortOrder,
            jsonQuery,
        });

        const storiesTotal = pagination.matched_records_number;

        return { stories, storiesTotal };
    }

    async getStoriesExtendedFromCategory(
        category: Category,
        options?: GetStoriesOptions,
    ) {
        const { stories } = await this.getStoriesFromCategory(category, options);
        const extendedStoriesPromises = stories.map((story) => this.getStory(story.id)) || [];

        return Promise.all(extendedStoriesPromises);
    }

    async getStoryBySlug(slug: string) {
        const jsonQuery = JSON.stringify(getSlugQuery(slug));
        const { stories } = await this.searchStories({
            limit: 1,
            jsonQuery,
        });

        if (stories[0]) {
            return this.getStory(stories[0].id);
        }

        return null;
    }

    async getCategories(): Promise<Category[]> {
        const categories = await this.sdk.newsroomCategories.list(this.newsroomUuid);

        return Array.isArray(categories) ? categories : Object.values(categories);
    }

    async getCategoryBySlug(slug: string) {
        const categories = await this.getCategories();

        return categories.find((category) => Object.values(category.i18n).some((t) => t.slug === slug));
    }

    searchStories: typeof PrezlySDK.prototype.stories.search = (options) => this.sdk.stories.search(options);
}
