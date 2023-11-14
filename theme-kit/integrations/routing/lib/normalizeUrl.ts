export function normalizeUrl(url: `/${string}`) {
    return url.replace(/\/{2,}/g, '/') as `/${string}`;
}
