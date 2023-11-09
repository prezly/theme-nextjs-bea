import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DeclareLanguages } from '@/components/DeclareLanguages';
import { Gallery } from '@/modules/Gallery';
import { Content } from '@/modules/Layout';
import { api, routing } from '@/theme-kit';
import { generateMediaAlbumMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: NewsroomGallery['uuid'];
    };
}

async function resolveAlbum({ uuid }: Props['params']) {
    const { contentDelivery } = api();
    return (await contentDelivery.gallery(uuid)) ?? notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const album = await resolveAlbum(params);

    return generateMediaAlbumMetadata({
        localeCode: params.localeCode,
        mediaAlbum: album,
    });
}

export default async function AlbumPage({ params }: Props) {
    const album = await resolveAlbum(params);
    const { generateUrl } = await routing();

    return (
        <Content>
            <DeclareLanguages routeName="mediaAlbum" params={{ uuid: album.uuid }} />
            <Gallery gallery={album} href={generateUrl('mediaAlbum', { uuid: album.uuid })} />
        </Content>
    );
}
