import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi, withAuthorization } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';
import { Category } from '@prezly/sdk/dist/types';

type Props = {
    stories: Story[];
    categories?: Array<Category>
};

const IndexPage: FunctionComponent<Props> = ({ stories, categories }) => (
    <Layout categories={categories}>
        <h1>Hello Prezly 👋</h1>
        <Stories stories={stories} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps<Props> = withAuthorization(async (context) => {
    const api = getPrezlyApi(context.req);
    const stories = await api.getAllStories();
    const categories = await api.getCategories();

    return {
        props: { stories, categories },
    };
});

export default IndexPage;
