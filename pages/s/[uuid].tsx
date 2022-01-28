import type { ExtendedStory } from '@prezly/sdk';
import { BasePageProps, getBasePageProps, processRequest } from '@prezly/theme-kit-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

interface Props extends BasePageProps {
    selectedStory: ExtendedStory;
}

const StoryPreviewPage: NextPage<Props> = ({ selectedStory }) => <Story story={selectedStory} />;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    try {
        const { api, basePageProps } = await getBasePageProps(context);
        const { uuid } = context.params as { uuid: string };
        const story = await api.getStory(uuid);

        basePageProps.isTrackingEnabled = false;
        basePageProps.translations = await importMessages(basePageProps.localeCode);
        basePageProps.selectedStory = story;

        return processRequest(context, basePageProps);
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
