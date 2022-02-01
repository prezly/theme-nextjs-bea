import {
    DUMMY_DEFAULT_LOCALE,
    getNewsroomServerSideProps,
    processRequest,
    useSelectedStory,
} from '@prezly/theme-kit-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';
import { AnyPageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPage: NextPage<AnyPageProps> = () => {
    const selectedStory = useSelectedStory();

    return <Story story={selectedStory!} />;
};

export const getServerSideProps: GetServerSideProps<AnyPageProps> = async (context) => {
    const { api, serverSideProps } = await getNewsroomServerSideProps(context);

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

    return processRequest(context, {
        ...serverSideProps,
        newsroomContextProps: {
            ...serverSideProps.newsroomContextProps,
            selectedStory: story,
        },
        translations: await importMessages(serverSideProps.newsroomContextProps.localeCode),
    });
};

export default StoryPage;
