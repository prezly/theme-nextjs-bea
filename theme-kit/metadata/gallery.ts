import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getGalleryThumbnail } from '@prezly/theme-kit-core';
import type { Metadata } from 'next';

interface Params {
    gallery: NewsroomGallery;
}
export function generateGalleryMetadata({ gallery }: Params): Metadata {
    const thumbnail = getGalleryThumbnail(gallery);
    const imageUrl = thumbnail ? getAssetsUrl(thumbnail.uuid) : undefined;

    return {
        title: gallery.name,
        openGraph: {
            images: imageUrl && [imageUrl],
        },
        twitter: {
            images: imageUrl && [imageUrl],
        },
    };
}
