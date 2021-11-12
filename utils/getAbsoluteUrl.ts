// Returns absolute URL based on the path and without any query parameters
export function getAbsoluteUrl(path: string = '/', origin: string): string {
    const url = new URL(path, origin);
    url.search = '';

    return url.toString();
}
