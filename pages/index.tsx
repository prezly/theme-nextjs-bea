import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';
import { Category, Newsroom } from '@prezly/sdk/dist/types';
import { PageSeo } from '@/components/seo';

type Props = {
    stories: Story[];
    categories?: Array<Category>;
    newsroom: Newsroom;
};

const IndexPage: FunctionComponent<Props> = ({ stories, categories, newsroom }) => (
    <>
        <PageSeo
            title={newsroom.display_name}
            description=""
            url={newsroom.url}
            // @ts-expect-error
            imageUrl={newsroom.newsroom_logo.cdnUrl}
        />
        <Layout categories={categories}>
            <h1>Hello Prezly 👋</h1>
            <Stories stories={stories} />
        </Layout>
    </>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const stories = await api.getStories();
    const categories = await api.getCategories();
    const newsroom = await api.getNewsroom();

    return {
        props: { stories, categories, newsroom },
    };
};

export default IndexPage;
