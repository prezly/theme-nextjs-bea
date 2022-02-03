// Returns absolute URL based on the path and without any query parameters
export function getAbsoluteUrl(path: string, origin: string, localeCode?: string | false): string {
    const url = new URL(`${localeCode ? `/${localeCode}` : ''}${path || '/'}`, origin);
    url.search = '';

    return url.toString();
}
