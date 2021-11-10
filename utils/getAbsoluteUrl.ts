export function getAbsoluteUrl(path: string = '/', origin: string): string {
    const url = new URL(path, origin);
    return url.toString();
}
