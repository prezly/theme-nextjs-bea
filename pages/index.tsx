import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
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
    pagination: PaginationProps;
}

const IndexPage: FunctionComponent<Props> = ({
    stories,
    categories,
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
            title={newsroom.display_name}
            description=""
            url={newsroom.url}
            imageUrl={getAssetsUrl(newsroom.newsroom_logo?.uuid as string)}
        />
        <Layout>
            <h1>Hello Prezly 👋</h1>

            {/* You can switch to infinite loading by uncommenting the `InfiniteStories` component below
            and removing the `PaginatedStories` component. */}
            <PaginatedStories stories={stories} pagination={pagination} />
            {/* <InfiniteStories initialStories={stories} pagination={pagination} /> */}
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);

    const page = context.query.page && typeof context.query.page === 'string'
        ? Number(context.query.page)
        : undefined;

    const [storiesPaginated, categories, newsroom, companyInformation] = await Promise.all([
        api.getStories({ page }),
        api.getCategories(),
        api.getNewsroom(),
        api.getCompanyInformation(),
    ]);

    const { stories, storiesTotal } = storiesPaginated;

    return {
        props: {
            stories,
            categories,
            newsroom,
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
