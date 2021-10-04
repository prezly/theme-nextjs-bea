import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import { Category } from '@prezly/sdk/dist/types';
import { BasePageProps, PaginationProps } from 'types';
import { getPrezlyApi } from '@/utils/prezly';
import Layout from '@/components/Layout';
import { PaginatedStories } from '@/modules/Stories';
import { PageSeo } from '@/components/seo';
import getAssetsUrl from '@/utils/prezly/getAssetsUrl';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { DEFAULT_PAGE_SIZE } from '@/utils/prezly/constants';

interface Props extends BasePageProps {
    stories: Story[];
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
    pagination,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
    >
        <PageSeo
            title={category.display_name}
            description={category.display_description as string}
            url={`${newsroom.url}/category/${slug}`}
            imageUrl={getAssetsUrl(newsroom.newsroom_logo?.uuid as string)}
        />
        <Layout>
            <h1>{category.display_name}</h1>
            <p>{category.display_description}</p>

            {/* You can switch to infinite loading by uncommenting the `InfiniteStories` component below
            and removing the `PaginatedStories` component. */}
            <PaginatedStories stories={stories} pagination={pagination} />
            {/* <InfiniteStories initialStories={stories} pagination={pagination} category={category} /> */}
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);
    const { slug } = context.params as { slug: string };

    const [categories, category, newsroom, companyInformation] = await Promise.all([
        api.getCategories(),
        api.getCategoryBySlug(slug),
        api.getNewsroom(),
        api.getCompanyInformation(),
    ]);

    if (!category) {
        return {
            notFound: true,
        };
    }

    const page = context.query.page && typeof context.query.page === 'string'
        ? Number(context.query.page)
        : undefined;

    const { stories, storiesTotal } = await api.getStoriesFromCategory(category, { page });

    return {
        props: {
            stories,
            category,
            categories,
            newsroom,
            slug,
            companyInformation,
            pagination: {
                itemsTotal: storiesTotal,
                currentPage: page ?? 1,
                pageSize: DEFAULT_PAGE_SIZE,
            },
        },
    };
};

export default IndexPage;
