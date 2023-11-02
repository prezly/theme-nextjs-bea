import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getGalleryThumbnail } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { generateMetadata } from './utils';

interface Params {
    localeCode: Locale.Code;
    gallery: NewsroomGallery;
}
export function generateGalleryMetadata({ localeCode, gallery }: Params): Promise<Metadata> {
    const thumbnail = getGalleryThumbnail(gallery);
    const imageUrl = thumbnail ? getAssetsUrl(thumbnail.uuid) : undefined;

    return generateMetadata({
        localeCode,
        title: gallery.name,
        openGraph: {
            images: imageUrl && [imageUrl],
        },
        twitter: {
            images: imageUrl && [imageUrl],
        },
    });
}
