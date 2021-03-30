import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi, withAuthorization } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';
import { Category } from '@prezly/sdk/dist/types';
import { DEFAULT_LOCALE } from '@/utils/constants';

type Props = {
    stories: Story[];
    category: Category
    categories: Category[]
};

const IndexPage: FunctionComponent<Props> = ({ category, stories, categories }) => (
    <Layout categories={categories}>
        <h1>{category.i18n[DEFAULT_LOCALE].name}</h1>
        <p>
            {category.i18n[DEFAULT_LOCALE].description}
        </p>
        <Stories stories={stories} />
    </Layout>
);

export const getServerSideProps: GetServerSideProps<Props> = withAuthorization<Props>(
    async (context) => {
        const api = getPrezlyApi(context.req);
        const { slug } = context.params as { slug: string };
        const categories = await api.getCategories();
        const category = await api.getCategoryBySlug(slug);

        if (!category) {
            return {
                notFound: true,
            };
        }

        const stories = await api.getAllStoriesFromCategory(category);

        return {
            props: { stories, category, categories },
        };
    },
);

export default IndexPage;
