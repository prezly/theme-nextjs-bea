export function parseBoolean(value: string | undefined | null): boolean {
    if (!value) {
        return false;
    }

    try {
        return JSON.parse(value);
    } catch {
        return false;
    }
}
