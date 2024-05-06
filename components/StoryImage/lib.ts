import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

import type { ListStory } from 'types';

export type CardSize = 'small' | 'medium' | 'big' | 'tiny';

export function getStoryThumbnail(
    story: Pick<ListStory, 'thumbnail_image'>,
): UploadcareImageDetails | null {
    const { thumbnail_image } = story;

    if (thumbnail_image) {
        return JSON.parse(thumbnail_image);
    }

    return null;
}

export function getCardImageSizes(cardSize: CardSize) {
    if (cardSize === 'tiny') {
        return '60px';
    }

    return [
        '(max-width: 430px) 390px',
        '(max-width: 767px) 90vw',
        '(max-width: 1023px) 480px',
        getDesktopImageSize(cardSize),
    ].join(', ');
}

function getDesktopImageSize(cardSize: CardSize) {
    switch (cardSize) {
        case 'medium':
            return '380px';
        case 'small':
            return '240px';
        default:
            return '600px';
    }
}
