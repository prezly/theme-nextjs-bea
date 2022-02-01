import type { NewsroomGallery } from '@prezly/sdk';
import { getNewsroomServerSideProps, processRequest } from '@prezly/theme-kit-nextjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages } from '@/utils';
import { BasePageProps } from 'types';

const Gallery = dynamic(() => import('@/modules/Gallery'), { ssr: true });

interface Props extends BasePageProps {
    gallery: NewsroomGallery;
}

const GalleryPage: FunctionComponent<Props> = ({ gallery }) => <Gallery gallery={gallery} />;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, serverSideProps } = await getNewsroomServerSideProps(context);

    const { uuid } = context.params as { uuid: string };
    const gallery = await api.getGallery(uuid);

    return processRequest(
        context,
        {
            ...serverSideProps,
            gallery,
            translations: await importMessages(serverSideProps.newsroomContextProps.localeCode),
        },
        `/media/album/${uuid}`,
    );
};

export default GalleryPage;
