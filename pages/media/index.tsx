import type { NewsroomGallery } from '@prezly/sdk';
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
    themePreset,
    algoliaSettings,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        translations={translations}
        themePreset={themePreset}
        algoliaSettings={algoliaSettings}
    >
        <Galleries initialGalleries={galleries} pagination={pagination} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale, query } = context;
    const api = getPrezlyApi(request);

    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

    const basePageProps = await api.getBasePageProps(request, locale);

    if (!basePageProps.localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(basePageProps, locale, '/media');
    if (redirect) {
        return { redirect };
    }

    const { galleries, pagination } = await api.getGalleries({ page, pageSize: PAGE_SIZE });

    // If there's only one gallery, redirect to it immediately
    if (galleries.length === 1) {
        const { uuid } = galleries[0];

        return {
            redirect: {
                destination: `/media/album/${uuid}`,
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
