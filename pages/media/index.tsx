import type { NewsroomGallery } from '@prezly/sdk';
import { getNewsroomServerSideProps, processRequest } from '@prezly/theme-kit-nextjs';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages, isTrackingEnabled } from '@/utils';
import type { BasePageProps, PaginationProps } from 'types';

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
    const { api, serverSideProps } = await getNewsroomServerSideProps(context);
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

    return processRequest(
        context,
        {
            ...serverSideProps,
            galleries,
            pagination: {
                itemsTotal: pagination.matched_records_number,
                currentPage: page ?? 1,
                pageSize: PAGE_SIZE,
            },
            isTrackingEnabled: isTrackingEnabled(context),
            translations: await importMessages(serverSideProps.newsroomContextProps.localeCode),
        },
        '/media',
    );
};

export default GalleriesPage;
