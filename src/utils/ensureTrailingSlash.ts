export function ensureTrailingSlash(value: string): string {
    if (value.endsWith('/')) {
        return value;
    }

    return `${value}/`;
}
