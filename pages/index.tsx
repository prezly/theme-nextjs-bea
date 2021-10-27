import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { PageSeo } from '@/components/seo';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import type { StoryWithImage } from '@/modules/Stories';
import { getPrezlyApi } from '@/utils/prezly';
import { DEFAULT_PAGE_SIZE } from '@/utils/prezly/constants';
import getAssetsUrl from '@/utils/prezly/getAssetsUrl';
import { BasePageProps, PaginationProps } from 'types';

const InfiniteStories = dynamic(() => import('@/modules/Stories/InfiniteStories'), { ssr: true });
const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });

interface Props extends BasePageProps {
    stories: StoryWithImage[];
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
            <InfiniteStories initialStories={stories} pagination={pagination} />
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);

    const page =
        context.query.page && typeof context.query.page === 'string'
            ? Number(context.query.page)
            : undefined;

    const [storiesPaginated, categories, newsroom, companyInformation] = await Promise.all([
        api.getStories({ page, include: ['header_image'] }),
        api.getCategories(),
        api.getNewsroom(),
        api.getCompanyInformation(),
    ]);

    const { stories, storiesTotal } = storiesPaginated;

    return {
        props: {
            // TODO: This is temporary until return types from API are figured out
            stories: stories as StoryWithImage[],
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
