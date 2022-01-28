import type { ExtendedStory } from '@prezly/sdk';
import {
    BasePageProps,
    DUMMY_DEFAULT_LOCALE,
    getBasePageProps,
    processRequest,
} from '@prezly/theme-kit-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

interface Props extends BasePageProps {
    selectedStory: ExtendedStory;
}

const StoryPage: NextPage<Props> = ({ selectedStory }) => <Story story={selectedStory!} />;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, basePageProps } = await getBasePageProps(context);

    const { slug } = context.params as { slug?: string };
    const story = slug ? await api.getStoryBySlug(slug) : null;

    if (!story) {
        return { notFound: true };
    }

    const { locale } = context;
    if (locale && locale !== DUMMY_DEFAULT_LOCALE) {
        return {
            redirect: {
                destination: `/${slug}`,
                permanent: true,
            },
        };
    }

    basePageProps.translations = await importMessages(basePageProps.localeCode);
    basePageProps.selectedStory = story;

    return processRequest(context, basePageProps);
};

export default StoryPage;
