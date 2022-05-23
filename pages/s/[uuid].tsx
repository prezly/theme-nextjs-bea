import type { ExtendedStory } from '@prezly/sdk';
import { getStoryPreviewPageServerSideProps, useCurrentStory } from '@prezly/theme-kit-nextjs';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';
import type { BasePageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPreviewPage: NextPage<BasePageProps> = () => {
    const currentStory = useCurrentStory();

    return <Story story={currentStory as ExtendedStory} />;
};

export const getServerSideProps = getStoryPreviewPageServerSideProps<BasePageProps>(
    async (_, { newsroomContextProps }) => ({
        isTrackingEnabled: false,
        translations: await importMessages(newsroomContextProps.localeCode),
    }),
);

export default StoryPreviewPage;
