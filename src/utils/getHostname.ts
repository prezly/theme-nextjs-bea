export function getHostname(href: string): string {
    try {
        const url = new URL(href);
        return url.hostname;
    } catch {
        return '';
    }
}
