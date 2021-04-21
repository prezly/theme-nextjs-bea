import type { ExtendedStory } from '@prezly/sdk/dist/types';
import { GetServerSideProps, NextPage } from 'next';
import { getPrezlyApi } from '@/utils/prezly';
import Story from '@/modules/Story';
import Layout from '@/components/Layout';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { BasePageProps } from 'types';

interface Props extends BasePageProps {
    story: ExtendedStory;
}

const StoryPage: NextPage<Props> = ({
    story, categories, newsroom, companyInformation,
}) => (
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

export const getServerSideProps: GetServerSideProps = async (context) => {
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
