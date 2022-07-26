import type { ExtendedStory } from '@prezly/sdk';
import { getStoryPreviewPageServerSideProps, useCurrentStory } from '@prezly/theme-kit-nextjs';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages, loadFeaturedStories, loadRelatedStories } from '@/utils';
import type { BasePageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPreviewPage: NextPage<BasePageProps> = ({ relatedStories }) => {
    const currentStory = useCurrentStory();

    return <Story story={currentStory as ExtendedStory} relatedStories={relatedStories} />;
};

export const getServerSideProps = getStoryPreviewPageServerSideProps<BasePageProps>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: false,
        translations: await importMessages(newsroomContextProps.localeCode),
        featuredStories: await loadFeaturedStories(context),
        relatedStories: await loadRelatedStories(context, newsroomContextProps.currentStory),
    }),
);

export default StoryPreviewPage;
