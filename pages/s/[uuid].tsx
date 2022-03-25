import type { ExtendedStory } from '@prezly/sdk';
import {
    getNewsroomServerSideProps,
    getPrezlyApi,
    processRequest,
    useCurrentStory,
} from '@prezly/theme-kit-nextjs';
import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';
import type { BasePageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPreviewPage: NextPage<BasePageProps> = () => {
    const currentStory = useCurrentStory();

    return <Story story={currentStory as ExtendedStory} />;
};

export const getServerSideProps: GetServerSideProps<BasePageProps> = async (context) => {
    try {
        const api = getPrezlyApi(context.req);
        const { uuid } = context.params as { uuid: string };
        const story = await api.getStory(uuid);
        const { serverSideProps } = await getNewsroomServerSideProps(context, { story });

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
