import type { NewsroomGallery } from '@prezly/sdk';

export type PublicGallery = Pick<NewsroomGallery, 'images' | 'name' | 'thumbnail_image' | 'uuid'>;

export function sanitizeGalleries(galleries: NewsroomGallery[]): PublicGallery[] {
    return galleries.map(sanitizeGallery);
}

export function sanitizeGallery(gallery: NewsroomGallery): PublicGallery {
    const { images, name, thumbnail_image, uuid } = gallery;

    return { images, name, thumbnail_image, uuid };
}
