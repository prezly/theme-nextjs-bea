export function getWebsiteHostname(url: string): string {
    try {
        const urlObject = new URL(url);
        return urlObject.hostname;
    } catch (_error) {
        return url;
    }
}
