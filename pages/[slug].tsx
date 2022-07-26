import {
    getStoryPageStaticPaths,
    getStoryPageStaticProps,
    useCurrentStory,
} from '@prezly/theme-kit-nextjs';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import {
    importMessages,
    isTrackingEnabled,
    loadFeaturedStories,
    loadRelatedStories,
} from '@/utils';
import type { BasePageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPage: NextPage<BasePageProps> = ({ relatedStories }) => {
    const currentStory = useCurrentStory();

    return <Story story={currentStory!} relatedStories={relatedStories} />;
};

export const getStaticProps = getStoryPageStaticProps<BasePageProps>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
        featuredStories: await loadFeaturedStories(context),
        relatedStories: await loadRelatedStories(context, newsroomContextProps.currentStory),
    }),
);

export const getStaticPaths = getStoryPageStaticPaths;

export default StoryPage;
