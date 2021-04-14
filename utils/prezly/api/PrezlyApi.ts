import PrezlySDK, { NewsroomLanguageSettings, StoriesSearchRequest } from '@prezly/sdk';
import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { getSlugQuery, getSortByPublishedDate, getStoriesQuery } from './queries';

const DEFAULT_STORIES_COUNT = 6;
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

type SortOrder = 'desc' | 'asc';

export default class PrezlyApi {
    private readonly sdk: PrezlySDK;

    private readonly newsroomUuid: Newsroom['uuid'];

    private newsroom?: Newsroom;

    private newsroomLanguages?: NewsroomLanguageSettings[];

    constructor(accessToken: string, newsroomUuid: Newsroom['uuid']) {
        this.sdk = new PrezlySDK({ accessToken });
        this.newsroomUuid = newsroomUuid;
    }

    getStory(id: number) {
        return this.sdk.stories.get(id);
    }

    async getNewsroom() {
        if (!this.newsroom) {
            this.newsroom = await this.sdk.newsrooms.get(this.newsroomUuid);
        }

        return this.newsroom;
    }

    async getNewsroomLanguages() {
        if (!this.newsroomLanguages) {
            this.newsroomLanguages = (
                await this.sdk.newsroomLanguages.list(this.newsroomUuid)
            ).languages;
        }

        return this.newsroomLanguages;
    }

    async getNewsroomDefaultLanguage() {
        const languages = await this.getNewsroomLanguages();

        return languages.find(({ is_default }) => !!is_default);
    }

    async getCompanyInformation() {
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

    async getStories(limit = DEFAULT_STORIES_COUNT, order: SortOrder = DEFAULT_SORT_ORDER) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery(this.newsroomUuid));

        const { stories } = await this.searchStories({ limit, sortOrder, jsonQuery });
        return stories;
    }

    async getStoriesExtended(limit = DEFAULT_STORIES_COUNT, order: SortOrder = 'desc') {
        const stories = await this.getStories(limit, order);
        const extendedStoriesPromises = stories.map((story) => this.getStory(story.id));

        return Promise.all(extendedStoriesPromises);
    }

    async getStoriesExtendedFromCategory(
        category: Category,
        limit = DEFAULT_STORIES_COUNT,
        order: SortOrder = DEFAULT_SORT_ORDER,
    ) {
        const stories = await this.getStoriesFromCategory(category, limit, order);
        const extendedStoriesPromises = stories?.map((story) => this.getStory(story.id)) || [];

        return Promise.all(extendedStoriesPromises);
    }

    async getStoriesFromCategory(
        category: Category,
        limit = DEFAULT_STORIES_COUNT,
        order: SortOrder = DEFAULT_SORT_ORDER,
    ) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery(this.newsroomUuid, category.id));

        const { stories } = await this.searchStories({ limit, sortOrder, jsonQuery });

        return stories;
    }

    async getStoryBySlug(slug: string) {
        const jsonQuery = JSON.stringify(getSlugQuery(slug));
        const { stories } = await this.searchStories({
            limit: 1,
            jsonQuery,
        });

        if (stories?.[0]) {
            return this.getStory(stories?.[0].id);
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

    searchStories(options: StoriesSearchRequest) {
        return this.sdk.stories.search(options);
    }
}
