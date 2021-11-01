import { GetServerSideProps } from 'next';
import Head from 'next/head';
import type { FunctionComponent } from 'react';

import Layout from '@/components/Layout';
import { PageSeo } from '@/components/seo';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { InfiniteStories, StoryWithImage } from '@/modules/Stories';
import { getAssetsUrl, getPrezlyApi } from '@/utils/prezly';
import { DEFAULT_PAGE_SIZE } from '@/utils/prezly/constants';
import { BasePageProps, PaginationProps } from 'types';

interface Props extends BasePageProps {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

const IndexPage: FunctionComponent<Props> = ({
    stories,
    categories,
    newsroom,
    companyInformation,
    newsroomLanguages,
    locale,
    pagination,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        newsroomLanguages={newsroomLanguages}
        locale={locale}
    >
        <Head>
            {newsroom.icon && <link rel="shortcut icon" href={getAssetsUrl(newsroom.icon.uuid)} />}
        </Head>
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

    const [storiesPaginated, basePageProps] = await Promise.all([
        api.getStories({ page, include: ['header_image'] }),
        api.getBasePageProps(context.req, context.locale),
    ]);

    const { stories, storiesTotal } = storiesPaginated;

    return {
        props: {
            ...basePageProps,
            // TODO: This is temporary until return types from API are figured out
            stories: stories as StoryWithImage[],
            pagination: {
                itemsTotal: storiesTotal,
                currentPage: page ?? 1,
                pageSize: DEFAULT_PAGE_SIZE,
            },
        },
    };
};

export default IndexPage;
