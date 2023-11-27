import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateMediaAlbumPageMetadata, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Gallery } from '@/modules/Gallery';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: NewsroomGallery['uuid'];
    };
}

async function resolveAlbum({ uuid }: Props['params']) {
    return (await app().mediaAlbum(uuid)) ?? notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const album = await resolveAlbum(params);

    return generateMediaAlbumPageMetadata({
        locale: params.localeCode,
        album,
    });
}

export async function generateStaticParams() {
    const { galleries } = await app().mediaAlbums();
    const locales = await app().locales();

    return locales.map((localeCode) =>
        galleries.map((album) => ({ localeCode, uuid: album.uuid })),
    );
}

export default async function AlbumPage({ params }: Props) {
    const album = await resolveAlbum(params);
    const { generateUrl } = await routing();

    return (
        <>
            <BroadcastTranslations routeName="mediaAlbum" params={{ uuid: album.uuid }} />
            <Gallery
                localeCode={params.localeCode}
                gallery={album}
                href={generateUrl('mediaAlbum', { uuid: album.uuid })}
            />
        </>
    );
}
