import { NewsroomGallery } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { PageSeo } from '@/components/seo';
import { NewsroomContextProvider } from '@/contexts/newsroom';
import { getAssetsUrl, getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, PaginationProps } from 'types';

const InfiniteGalleries = dynamic(() => import('@/modules/Galleries/InfiniteGalleries'), {
    ssr: true,
});
const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });

const PAGE_SIZE = 6;

interface Props extends BasePageProps {
    galleries: NewsroomGallery[];
    pagination: PaginationProps;
}

const GalleriesPage: FunctionComponent<Props> = ({
    categories,
    companyInformation,
    galleries,
    languages,
    locale,
    newsroom,
    pagination,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        locale={locale}
    >
        <PageSeo
            title={companyInformation.name}
            description=""
            url={newsroom.url}
            imageUrl={getAssetsUrl(newsroom.newsroom_logo?.uuid as string)}
        />
        <Layout>
            <InfiniteGalleries initialGalleries={galleries} pagination={pagination} />
        </Layout>
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);

    const page =
        context.query.page && typeof context.query.page === 'string'
            ? Number(context.query.page)
            : undefined;

    const basePageProps = await api.getBasePageProps(context.locale);
    const { galleries, pagination } = await api.getGalleries({ page, pageSize: PAGE_SIZE });

    return {
        props: {
            ...basePageProps,
            galleries,
            pagination: {
                itemsTotal: pagination.matched_records_number,
                currentPage: page ?? 1,
                pageSize: PAGE_SIZE,
            },
        },
    };
};

export default GalleriesPage;
