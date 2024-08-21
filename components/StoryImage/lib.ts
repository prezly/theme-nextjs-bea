import type { Story } from '@prezly/sdk';
import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

export type CardSize = 'small' | 'medium' | 'big' | 'tiny';

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
        return '100px';
    }

    return [
        '(max-width: 430px) 390px',
        '(max-width: 767px) 730px',
        '(max-width: 1023px) 480px',
        getDesktopImageSize(cardSize),
    ].join(', ');
}

function getDesktopImageSize(cardSize: CardSize) {
    switch (cardSize) {
        case 'medium':
            return '380px';
        case 'small':
            return '200px';
        default:
            return '600px';
    }
}
