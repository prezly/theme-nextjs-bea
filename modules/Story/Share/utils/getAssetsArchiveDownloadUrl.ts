export const ASSETS_CDN_URL = 'https://cdn.uc.assets.prezly.com';

export function getAssetsArchiveDownloadUrl(assetsGroupUuid: string, slug: string): string {
    const safeSlug = encodeURIComponent(slug.replace(/\//g, '_'));
    return `${ASSETS_CDN_URL}/${assetsGroupUuid}/archive/zip/${safeSlug}.zip`;
}
