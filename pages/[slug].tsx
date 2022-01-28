import type { ExtendedStory } from '@prezly/sdk';
import {
    BasePageProps,
    DUMMY_DEFAULT_LOCALE,
    getBasePageProps,
    processRequest,
    useSelectedStory,
} from '@prezly/theme-kit-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPage: NextPage<BasePageProps> = () => {
    const selectedStory = useSelectedStory();

    // TODO: Update the type in library
    return <Story story={selectedStory as ExtendedStory} />;
};

export const getServerSideProps: GetServerSideProps<BasePageProps> = async (context) => {
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
