import { getStoryPageServerSideProps, useCurrentStory } from '@prezly/theme-kit-nextjs';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages, isTrackingEnabled } from '@/utils';
import type { BasePageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPage: NextPage<BasePageProps> = () => {
    const currentStory = useCurrentStory();

    return <Story story={currentStory!} />;
};

export const getServerSideProps = getStoryPageServerSideProps<BasePageProps>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
    }),
);

export default StoryPage;
