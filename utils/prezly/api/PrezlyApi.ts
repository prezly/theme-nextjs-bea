import PrezlySDK, { StoriesSearchRequest } from '@prezly/sdk';
import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { getSlugQuery, getSortByPublishedDate, getStoriesQuery } from './queries';

const DEFAULT_STORIES_COUNT = 6;
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

type SortOrder = 'desc' | 'asc';

export default class PrezlyApi {
    private readonly sdk: PrezlySDK;

    private readonly newsroomId: Newsroom['id'];

    private newsroom?: Newsroom;

    constructor(accessToken: string, newsroomId: Newsroom['id']) {
        this.sdk = new PrezlySDK({ accessToken });
        this.newsroomId = newsroomId;
        this.sdk.newsrooms.get(this.newsroomId).then((nr) => this.newsroom = nr);
    }

    getStory(id: number) {
        return this.sdk.stories.get(id);
    }

    async getNewsroom() {
        if (!this.newsroom) {
            this.newsroom = await this.sdk.newsrooms.get(this.newsroomId);
        }

        return this.newsroom;
    }

    async getNewsroomUuid() {
        return (await this.getNewsroom()).uuid;
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
        const jsonQuery = JSON.stringify(getStoriesQuery(await this.getNewsroomUuid()));

        const { stories } = await this.searchStories({ limit, sortOrder, jsonQuery });
        return stories;
    }

    async getAllStoriesExtended(limit = DEFAULT_STORIES_COUNT, order: SortOrder = 'desc') {
        const stories = await this.getAllStories(limit, order);
        const extendedStoriesPromises = stories.map((story) => this.getStory(story.id));

        return Promise.all(extendedStoriesPromises);
    }

    async getAllStoriesExtendedFromCategory(
        categoryName: Category['display_name'],
        limit = DEFAULT_STORIES_COUNT,
        order: SortOrder = DEFAULT_SORT_ORDER,
    ) {
        const stories = await this.getAllStoriesFromCategory(categoryName, limit, order);
        const extendedStoriesPromises = stories.map((story) => this.getStory(story.id));

        return Promise.all(extendedStoriesPromises);
    }

    async getAllStoriesFromCategory(
        categoryName: Category['display_name'],
        limit = DEFAULT_STORIES_COUNT,
        order: SortOrder = DEFAULT_SORT_ORDER,
    ) {
        const sortOrder = getSortByPublishedDate(order);
        const category = await this.getCategory(categoryName);

        if (!category) {
            // 404?
            return [];
        }

        const jsonQuery = JSON.stringify(
            getStoriesQuery(await this.getNewsroomUuid(), category.id),
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
        const categories = await this.sdk.newsroomCategories.list(this.newsroomId);

        return Array.isArray(categories) ? categories : Object.values(categories);
    }

    async getCategory(displayName: Category['display_name']) {
        const categories = await this.getCategories();

        return categories.find((c) => c.display_name === displayName);
    }

    searchStories(options: StoriesSearchRequest) {
        return this.sdk.stories.search(options);
    }
}
