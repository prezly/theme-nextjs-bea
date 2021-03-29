import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi, withAuthorization } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';
import { Category } from '@prezly/sdk/dist/types';

type Props = {
    stories: Story[];
    category: Category
    categories: Category[]
};

const IndexPage: FunctionComponent<Props> = ({ category, stories, categories }) => (
    <Layout categories={categories}>
        <h1>{category.display_name}</h1>
        <Stories stories={stories} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps<Props> = withAuthorization(async (context) => {
    const api = getPrezlyApi(context.req);
    const { name } = context.params;
    const categories = await api.getCategories();
    const category = await api.getCategory(name);
    // TODO: remove limit when categories are filtered on query
    // https://github.com/prezly/theme-nextjs-starter/pull/7/commits/4e7dac0b2410624f49ac598b75be338bb6ce81bb
    const stories = await api.getAllStoriesFromCategory(name, 200);

    return {
        props: { stories, category, categories },
    };
});

export default IndexPage;
