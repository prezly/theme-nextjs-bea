import type { ExtendedStory } from '@prezly/sdk';
import {
    getNewsroomServerSideProps,
    processRequest,
    useCurrentStory,
} from '@prezly/theme-kit-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';
import { AnyPageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPreviewPage: NextPage<AnyPageProps> = () => {
    const currentStory = useCurrentStory();

    return <Story story={currentStory as ExtendedStory} />;
};

export const getServerSideProps: GetServerSideProps<AnyPageProps> = async (context) => {
    try {
        const { api, serverSideProps } = await getNewsroomServerSideProps(context);
        const { uuid } = context.params as { uuid: string };
        const story = await api.getStory(uuid);

        return processRequest(context, {
            ...serverSideProps,
            newsroomContextProps: {
                ...serverSideProps.newsroomContextProps,
                currentStory: story,
            },
            isTrackingEnabled: false,
            translations: await importMessages(serverSideProps.newsroomContextProps.localeCode),
        });
    } catch (error) {
        // Log the error into NextJS console
        // eslint-disable-next-line no-console
        console.error(error);

        return {
            notFound: true,
        };
    }
};

export default StoryPreviewPage;
