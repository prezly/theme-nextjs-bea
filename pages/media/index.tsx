import { NewsroomGallery } from '@prezly/sdk';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { importMessages } from '@/utils/lang';
import { getRedirectToCanonicalLocale } from '@/utils/locale';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, PaginationProps, Translations } from 'types';

const Galleries = dynamic(() => import('@/modules/Galleries'), { ssr: true });

const PAGE_SIZE = 6;

interface Props extends BasePageProps {
    galleries: NewsroomGallery[];
    pagination: PaginationProps;
    translations: Translations;
}

const GalleriesPage: FunctionComponent<Props> = ({
    categories,
    companyInformation,
    galleries,
    languages,
    localeCode,
    newsroom,
    pagination,
    translations,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        translations={translations}
    >
        <Galleries initialGalleries={galleries} pagination={pagination} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const api = getPrezlyApi(context.req);

    const page =
        context.query.page && typeof context.query.page === 'string'
            ? Number(context.query.page)
            : undefined;

    const basePageProps = await api.getBasePageProps(context.locale);

    if (!basePageProps.localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(basePageProps, context.locale, '/media');
    if (redirect) {
        return { redirect };
    }

    const { galleries, pagination } = await api.getGalleries({ page, pageSize: PAGE_SIZE });

    // If there's only one gallery, redirect to it immediately
    if (galleries.length === 1) {
        const { uuid } = galleries[0];

        return {
            redirect: {
                destination: `/gallery/${uuid}`,
                permanent: false,
            },
        };
    }

    const translations = await importMessages(basePageProps.localeCode);

    return {
        props: {
            ...basePageProps,
            galleries,
            pagination: {
                itemsTotal: pagination.matched_records_number,
                currentPage: page ?? 1,
                pageSize: PAGE_SIZE,
            },
            translations,
        },
    };
};

export default GalleriesPage;
