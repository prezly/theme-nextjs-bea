import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi } from '@/utils/prezly';
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
        <p>
            {category.display_description}
        </p>
        <Stories stories={stories} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const { slug } = context.params as { slug: string };
    const categories = await api.getCategories();
    const category = await api.getCategoryBySlug(slug);

    if (!category) {
        return {
            notFound: true,
        };
    }

    const stories = await api.getStoriesFromCategory(category);

    return {
        props: { stories, category, categories },
    };
};

export default IndexPage;
