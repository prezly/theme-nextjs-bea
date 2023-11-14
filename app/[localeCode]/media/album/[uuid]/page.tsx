import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getGalleryThumbnail } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Gallery } from '@/modules/Gallery';
import { Content, Header } from '@/modules/Layout';
import { api, generatePageMetadata, routing } from '@/theme/server';

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
    const { generateUrl } = await routing();

    const thumbnail = getGalleryThumbnail(album);
    const imageUrl = thumbnail ? getAssetsUrl(thumbnail.uuid) : undefined;

    return generatePageMetadata({
        title: album.title,
        imageUrl,
        generateUrl: (localeCode) => generateUrl('mediaAlbum', { localeCode, uuid: album.uuid }),
    });
}

export default async function AlbumPage({ params }: Props) {
    const album = await resolveAlbum(params);
    const { generateUrl } = await routing();

    return (
        <>
            <Header routeName="mediaAlbum" params={{ uuid: album.uuid }} />
            <Content>
                <Gallery gallery={album} href={generateUrl('mediaAlbum', { uuid: album.uuid })} />
            </Content>
        </>
    );
}
