/** Also recognizes locale and reverse-proxy base-path prefixes. */
export function isGalleryPreviewPath(pathname: string): boolean {
    return /(?:^|\/)media\/preview(?:\/|$)/.test(pathname);
}

export const GALLERY_PREVIEW_HEADER = 'x-prezly-gallery-preview';
export const GALLERY_PREVIEW_CACHE_CONTROL = 'private, no-cache, no-store, max-age=0';
