import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';
import { generateGalleryMetadata } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: string;
    };
}

async function resolveAlbum({ uuid }: Props['params']) {
    const { contentDelivery } = api();
    return (await contentDelivery.gallery(uuid)) ?? notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const album = await resolveAlbum(params);

    return generateGalleryMetadata({ gallery: album });
}

export default async function AlbumPage({ params }: Props) {
    const album = await resolveAlbum(params);
    return <div>Album: {album.uuid}</div>;
}
