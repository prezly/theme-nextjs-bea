import type { ExtendedStory } from '@prezly/sdk/dist/types';
import { GetServerSideProps, NextPage } from 'next';

import Layout from '@/components/Layout';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import Story from '@/modules/Story';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps } from 'types';

interface Props extends BasePageProps {
    story: ExtendedStory;
}

const StoryPage: NextPage<Props> = ({
    story,
    categories,
    newsroom,
    companyInformation,
    newsroomLanguages,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        newsroomLanguages={newsroomLanguages}
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

    const [categories, newsroom, companyInformation, newsroomLanguages] = await Promise.all([
        api.getCategories(),
        api.getNewsroom(),
        api.getCompanyInformation(),
        api.getNewsroomLanguages(),
    ]);

    return {
        props: {
            story,
            categories,
            newsroom,
            companyInformation,
            newsroomLanguages,
        },
    };
};

export default StoryPage;
