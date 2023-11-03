import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getGalleryThumbnail } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { routing } from '@/theme-kit';

import { generateAlternateLanguageLinks, generateMetadata } from './utils';

interface Params {
    localeCode: Locale.Code;
    mediaAlbum: NewsroomGallery;
}
export async function generateMediaAlbumMetadata({
    localeCode,
    mediaAlbum,
}: Params): Promise<Metadata> {
    const { generateUrl } = await routing();

    const thumbnail = getGalleryThumbnail(mediaAlbum);
    const imageUrl = thumbnail ? getAssetsUrl(thumbnail.uuid) : undefined;

    const languages = await generateAlternateLanguageLinks((locale) =>
        generateUrl('mediaAlbum', {
            localeCode: locale.code,
            uuid: mediaAlbum.uuid,
        }),
    );

    return generateMetadata({
        localeCode,
        imageUrl,
        title: mediaAlbum.name,
        alternates: {
            canonical: generateUrl('mediaAlbum', { localeCode, uuid: mediaAlbum.uuid }),
            languages,
        },
    });
}
