import type { ExtendedStory } from '@prezly/sdk';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps } from 'types';

const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });
const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

interface Props extends BasePageProps {
    story: ExtendedStory;
}

const StoryPage: NextPage<Props> = ({ story, categories, newsroom, companyInformation }) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
    >
        <Layout>
            <Story story={story} />
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const { slug } = context.params as { slug?: string };
    const story = slug ? await api.getStoryBySlug(slug) : null;

    if (!story) {
        return { notFound: true };
    }

    const [categories, newsroom, companyInformation] = await Promise.all([
        api.getCategories(),
        api.getNewsroom(),
        api.getCompanyInformation(),
    ]);

    return {
        props: {
            story,
            categories,
            newsroom,
            companyInformation,
        },
    };
};

export default StoryPage;
