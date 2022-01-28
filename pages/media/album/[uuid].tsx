import type { NewsroomGallery } from '@prezly/sdk';
import { BasePageProps, getBasePageProps, processRequest } from '@prezly/theme-kit-nextjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils';

const Gallery = dynamic(() => import('@/modules/Gallery'), { ssr: true });

interface Props extends BasePageProps {
    gallery: NewsroomGallery;
}

const GalleryPage: FunctionComponent<Props> = ({ gallery }) => <Gallery gallery={gallery} />;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, basePageProps } = await getBasePageProps(context);

    const { uuid } = context.params as { uuid: string };
    const gallery = await api.getGallery(uuid);

    basePageProps.translations = await importMessages(basePageProps.localeCode);

    return processRequest(context, basePageProps, `/media/album/${uuid}`, {
        gallery,
    });
};

export default GalleryPage;
