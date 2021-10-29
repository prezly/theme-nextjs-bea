import { Category } from '@prezly/sdk/dist/types';
import { GetServerSideProps } from 'next';
import type { FunctionComponent } from 'react';

import Layout from '@/components/Layout';
import { PageSeo } from '@/components/seo';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { CategoryHeader, InfiniteStories, StoryWithImage } from '@/modules/Stories';
import { getPrezlyApi } from '@/utils/prezly';
import { DEFAULT_PAGE_SIZE } from '@/utils/prezly/constants';
import getAssetsUrl from '@/utils/prezly/getAssetsUrl';
import { BasePageProps, PaginationProps } from 'types';

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    category: Category;
    slug: string;
    pagination: PaginationProps;
}

const IndexPage: FunctionComponent<Props> = ({
    category,
    stories,
    categories,
    slug,
    newsroom,
    companyInformation,
    newsroomLanguages,
    pagination,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        newsroomLanguages={newsroomLanguages}
    >
        <PageSeo
            title={category.display_name}
            description={category.display_description as string}
            url={`${newsroom.url}/category/${slug}`}
            imageUrl={getAssetsUrl(newsroom.newsroom_logo?.uuid as string)}
        />
        <Layout>
            <CategoryHeader category={category} />

            <InfiniteStories initialStories={stories} pagination={pagination} category={category} />
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const { slug } = context.params as { slug: string };

    const category = await api.getCategoryBySlug(slug);

    if (!category) {
        return {
            notFound: true,
        };
    }

    const basePageProps = await api.getBasePageProps();

    const page =
        context.query.page && typeof context.query.page === 'string'
            ? Number(context.query.page)
            : undefined;

    const { stories, storiesTotal } = await api.getStoriesFromCategory(category, {
        page,
        include: ['header_image'],
    });

    return {
        props: {
            ...basePageProps,
            // TODO: This is temporary until return types from API are figured out
            stories: stories as StoryWithImage[],
            category,
            slug,
            pagination: {
                itemsTotal: storiesTotal,
                currentPage: page ?? 1,
                pageSize: DEFAULT_PAGE_SIZE,
            },
        },
    };
};

export default IndexPage;
