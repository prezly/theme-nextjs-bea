import type { NewsroomGallery } from '@prezly/sdk';
import { BasePageProps, getBasePageProps, processRequest } from '@prezly/theme-kit-nextjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils';
import { PaginationProps } from 'types';

const Galleries = dynamic(() => import('@/modules/Galleries'), { ssr: true });

const PAGE_SIZE = 6;

interface Props extends BasePageProps {
    galleries: NewsroomGallery[];
    pagination: PaginationProps;
}

const GalleriesPage: FunctionComponent<Props> = ({ galleries, pagination }) => (
    <Galleries initialGalleries={galleries} pagination={pagination} />
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, basePageProps } = await getBasePageProps(context);
    const { query } = context;

    const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;
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

    basePageProps.translations = await importMessages(basePageProps.localeCode);

    return processRequest(context, basePageProps, '/media', {
        galleries,
        pagination: {
            itemsTotal: pagination.matched_records_number,
            currentPage: page ?? 1,
            pageSize: PAGE_SIZE,
        },
    });
};

export default GalleriesPage;
