import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Galleries, Uploads } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Gallery } from '@/modules/Gallery';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: NewsroomGallery['uuid'];
    };
}

async function resolveAlbum({ uuid }: Props['params']) {
    return (await app().gallery(uuid)) ?? notFound();
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
            <BroadcastTranslations routeName="mediaAlbum" params={{ uuid: album.uuid }} />
            <Gallery gallery={album} href={generateUrl('mediaAlbum', { uuid: album.uuid })} />
        </>
    );
}
