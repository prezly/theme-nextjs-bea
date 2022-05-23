import {
    type GalleryAlbumPageProps,
    getGalleryAlbumPageServerSideProps,
} from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages, isTrackingEnabled } from '@/utils';
import type { BasePageProps } from 'types';

const Gallery = dynamic(() => import('@/modules/Gallery'), { ssr: true });

type Props = BasePageProps & GalleryAlbumPageProps;

const GalleryPage: FunctionComponent<Props> = ({ gallery }) => <Gallery gallery={gallery} />;

export const getServerSideProps = getGalleryAlbumPageServerSideProps<BasePageProps>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
    }),
);

export default GalleryPage;
