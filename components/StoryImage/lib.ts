/* eslint-disable @typescript-eslint/no-use-before-define */

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
        return {
            default: 60,
        };
    }

    return {
        mobile: 420,
        tablet: cardSize === 'big' ? 350 : 240,
        desktop: getDesktopImageSize(cardSize),
        default: 600,
    };
}

function getDesktopImageSize(cardSize: CardSize) {
    switch (cardSize) {
        case 'medium':
            return 380;
        case 'small':
            return 240;
        default:
            return 600;
    }
}
