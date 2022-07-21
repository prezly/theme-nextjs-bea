import { getPrezlyApi } from '@prezly/theme-kit-nextjs';
import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

import type { StoryWithImage } from 'types';

import withCache from './withCache';

const CACHE_KEY = 'HEADER_FEATURED_STORIES';

export function loadFeaturedStories(context: GetStaticPropsContext | GetServerSidePropsContext) {
    return withCache(CACHE_KEY, async () => {
        const api = getPrezlyApi('req' in context ? context.req : undefined);

        const { stories } = await api.getStories({ pageSize: 2, include: ['thumbnail_image'] });

        return stories as StoryWithImage[];
    });
}
