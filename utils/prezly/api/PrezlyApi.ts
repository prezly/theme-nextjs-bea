import PrezlySDK, { StoriesSearchRequest } from '@prezly/sdk';
import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { getSlugQuery, getSortByPublishedDate, getStoriesQuery } from './queries';

const DEFAULT_STORIES_COUNT = 6;
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

type SortOrder = 'desc' | 'asc';

export default class PrezlyApi {
    private readonly sdk: PrezlySDK;

    private readonly newsroomUuid: Newsroom['uuid'];

    private newsroom?: Newsroom;

    constructor(accessToken: string, newsroomUuid: Newsroom['uuid']) {
        this.sdk = new PrezlySDK({ accessToken });
        this.newsroomUuid = newsroomUuid;
        this.sdk.newsrooms.get(this.newsroomUuid).then((nr) => this.newsroom = nr);
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

    async getAllStoriesNoLimit(order: SortOrder = DEFAULT_SORT_ORDER) {
        const sortOrder = getSortByPublishedDate(order);
        const newsroom = await this.getNewsroom();
        const jsonQuery = JSON.stringify(getStoriesQuery(newsroom.uuid));
        const maxStories = newsroom.stories_number;
        const chunkSize = 200;

        const promises = [];

        for (let offset = 0; offset < maxStories; offset += chunkSize) {
            promises.push(this.searchStories({
                limit: chunkSize, sortOrder, jsonQuery, offset,
            }));
        }

        const stories = (await Promise.all(promises))
            .map((r) => r.stories)
            .reduce((arr, item) => [...arr, ...item], []); // flat

        return stories;
    }

    async getAllStories(limit = DEFAULT_STORIES_COUNT, order: SortOrder = DEFAULT_SORT_ORDER) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery(this.newsroomUuid));

        const { stories } = await this.searchStories({ limit, sortOrder, jsonQuery });
        return stories;
    }

    async getAllStoriesExtended(limit = DEFAULT_STORIES_COUNT, order: SortOrder = 'desc') {
        const stories = await this.getAllStories(limit, order);
        const extendedStoriesPromises = stories.map((story) => this.getStory(story.id));

        return Promise.all(extendedStoriesPromises);
    }

    async getAllStoriesExtendedFromCategory(
        category: Category,
        limit = DEFAULT_STORIES_COUNT,
        order: SortOrder = DEFAULT_SORT_ORDER,
    ) {
        const stories = await this.getAllStoriesFromCategory(category, limit, order);
        const extendedStoriesPromises = stories?.map((story) => this.getStory(story.id)) || [];

        return Promise.all(extendedStoriesPromises);
    }

    async getAllStoriesFromCategory(
        category: Category,
        limit = DEFAULT_STORIES_COUNT,
        order: SortOrder = DEFAULT_SORT_ORDER,
    ) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(
            getStoriesQuery(this.newsroomUuid, category.id),
        );

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

        return categories
            .find((cat) => Object.values(cat.i18n).some((t) => t.slug === slug));
    }

    searchStories(options: StoriesSearchRequest) {
        return this.sdk.stories.search(options);
    }
}
