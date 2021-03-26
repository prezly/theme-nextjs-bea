import PrezlySDK, { StoriesSearchRequest } from '@prezly/sdk';
import { getSlugQuery, getSortByPublishedDate, getStoriesQuery } from './queries';

const DEFAULT_STORIES_COUNT = 6;

type SortOrder = 'desc' | 'asc';

export default class PrezlyApi {
    private readonly sdk: PrezlySDK;

    constructor(accessToken: string) {
        this.sdk = new PrezlySDK({ accessToken });
    }

    getStory(id: number) {
        return this.sdk.stories.get(id);
    }

    async getAllStories(limit = DEFAULT_STORIES_COUNT, order: SortOrder = 'desc') {
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

        return stories?.[0] || null;
    }

    async getCategories(newsroomId: number) {
        const categories = await this.sdk.newsroomCategories.list(newsroomId);

        return Array.isArray(categories) ? categories : Object.values(categories);
    }

    searchStories(options: StoriesSearchRequest) {
        return this.sdk.stories.search(options);
    }
}
