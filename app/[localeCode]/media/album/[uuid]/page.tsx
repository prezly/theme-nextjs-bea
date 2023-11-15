import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Galleries, Uploads } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { api, generatePageMetadata, routing } from '@/adapters/server';
import { Gallery } from '@/modules/Gallery';
import { Header } from '@/modules/Header';
import { Content } from '@/modules/Layout';

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

    const thumbnail = Galleries.getCoverImage(album);
    const imageUrl = thumbnail ? Uploads.getCdnUrl(thumbnail.uuid) : undefined;

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
