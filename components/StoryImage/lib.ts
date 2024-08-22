import type { Story } from '@prezly/sdk';
import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

export type ImageSize = 'small' | 'medium' | 'big' | 'hero' | 'full-width' | 'tiny';

export function getStoryThumbnail(
    thumbnailImage: Story.ExtraFields['thumbnail_image'],
): UploadcareImageDetails | null {
    if (thumbnailImage) {
        return JSON.parse(thumbnailImage);
    }

    return null;
}

export function getCardImageSizes(imageSize: ImageSize) {
    if (imageSize === 'tiny') {
        return '120px';
    }

    return [
        `(max-width: 767px) ${getPhoneImageSize(imageSize)}`,
        `(max-width: 1023px) ${getTabletImageSize(imageSize)}`,
        getDesktopImageSize(imageSize),
    ].join(', ');
}

function getPhoneImageSize(imageSize: ImageSize) {
    switch (imageSize) {
        case 'full-width':
        case 'hero':
            return '100w';
        default:
            return '95w';
    }
}

function getTabletImageSize(imageSize: ImageSize) {
    switch (imageSize) {
        case 'full-width':
        case 'hero':
            return '100w';
        case 'small':
            return '200px';
        default:
            return '460px';
    }
}

function getDesktopImageSize(imageSize: ImageSize) {
    switch (imageSize) {
        case 'full-width':
            return '1200px';
        case 'medium':
            return '370px';
        case 'small':
            return '200px';
        default:
            return '575px';
    }
}
