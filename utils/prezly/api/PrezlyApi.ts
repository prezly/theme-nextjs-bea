import PrezlySDK, { StoriesSearchRequest } from '@prezly/sdk';
import { getSlugQuery, getSortByPublishedDate, getStoriesQuery } from './queries';

const DEFAULT_STORIES_COUNT = 6;
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

type SortOrder = 'desc' | 'asc';

export default class PrezlyApi {
    private readonly sdk: PrezlySDK;

    constructor(accessToken: string) {
        this.sdk = new PrezlySDK({ accessToken });
    }

    getStory(id: number) {
        return this.sdk.stories.get(id);
    }

    async getAllStoriesNoLimit(order: SortOrder = DEFAULT_SORT_ORDER) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery());
        const maxStories = (await this.sdk.stories.list({ sortOrder }))
            .pagination
            .matched_records_number;
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
        const jsonQuery = JSON.stringify(getStoriesQuery());

        const { stories } = await this.searchStories({ limit, sortOrder, jsonQuery });
        return stories;
    }

    async getAllStoriesExtended(limit = DEFAULT_STORIES_COUNT, order: SortOrder = 'desc') {
        const stories = await this.getAllStories(limit, order);
        const extendedStoriesPromises = stories.map((story) => this.getStory(story.id));

        return await Promise.all(extendedStoriesPromises);
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

    async getCategories(newsroomId: number) {
        const categories = await this.sdk.newsroomCategories.list(newsroomId);

        return Array.isArray(categories) ? categories : Object.values(categories);
    }

    searchStories(options: StoriesSearchRequest) {
        return this.sdk.stories.search(options);
    }
}
