import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { getPrezlyApi } from '@/utils/prezly';
import Layout from '@/components/Layout';
import Stories from '@/modules/Stories';
import { Category } from '@prezly/sdk/dist/types';
import { PageSeo } from '@/components/seo';
import getAssetsUrl from '@/utils/prezly/getAssetsUrl';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { BasePageProps } from 'types';

interface Props extends BasePageProps {
    stories: Story[];
    category: Category;
    slug: string;
}

const IndexPage: FunctionComponent<Props> = ({
    category, stories, categories, slug, newsroom,
}) => (
    <NewsroomContextProvider categories={categories} newsroom={newsroom}>
        <PageSeo
            title={category.display_name}
            description={category.display_description as string}
            url={`${newsroom.url}/category/${slug}`}
            imageUrl={getAssetsUrl(newsroom.newsroom_logo?.uuid as string)}
        />
        <Layout>
            <h1>{category.display_name}</h1>
            <p>{category.display_description}</p>
            <Stories stories={stories} />
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const { slug } = context.params as { slug: string };
    const categories = await api.getCategories();
    const category = await api.getCategoryBySlug(slug);
    const newsroom = await api.getNewsroom();

    if (!category) {
        return {
            notFound: true,
        };
    }

    const stories = await api.getStoriesFromCategory(category);

    return {
        props: {
            stories,
            category,
            categories,
            newsroom,
            slug,
        },
    };
};

export default IndexPage;
