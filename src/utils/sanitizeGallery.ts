import type { NewsroomGallery } from '@prezly/sdk';

import type { PublicUserRef } from './sanitizeStory';
import { sanitizeUserRef } from './sanitizeStory';

export type PublicGallery = Omit<NewsroomGallery, 'creator'> & {
    creator: PublicUserRef | null;
};

export function sanitizeGalleries(galleries: NewsroomGallery[]): PublicGallery[] {
    return galleries.map(sanitizeGallery);
}

export function sanitizeGallery(gallery: NewsroomGallery): PublicGallery {
    const { creator, ...rest } = gallery;

    return {
        ...rest,
        creator: sanitizeUserRef(creator),
    };
}
