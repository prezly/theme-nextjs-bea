import type { Story } from '@prezly/sdk';
import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

export type CardSize = 'small' | 'medium' | 'big' | 'hero' | 'tiny';

export function getStoryThumbnail(
    thumbnailImage: Story.ExtraFields['thumbnail_image'],
): UploadcareImageDetails | null {
    if (thumbnailImage) {
        return JSON.parse(thumbnailImage);
    }

    return null;
}

export function getCardImageSizes(cardSize: CardSize) {
    if (cardSize === 'tiny') {
        return '120px';
    }

    return [
        `(max-width: 767px) ${getPhoneImageSize(cardSize)}`,
        `(max-width: 1023px) ${getTabletImageSize(cardSize)}`,
        getDesktopImageSize(cardSize),
    ].join(', ');
}

function getPhoneImageSize(cardSize: CardSize) {
    switch (cardSize) {
        case 'hero':
            return '100w';
        default:
            return '95w';
    }
}

function getTabletImageSize(cardSize: CardSize) {
    switch (cardSize) {
        case 'hero':
            return '100w';
        case 'small':
            return '200px';
        default:
            return '460px';
    }
}

function getDesktopImageSize(cardSize: CardSize) {
    switch (cardSize) {
        case 'medium':
            return '370px';
        case 'small':
            return '200px';
        default:
            return '575px';
    }
}
