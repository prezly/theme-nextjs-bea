export function parseBoolean(value: string | undefined | null): boolean {
    if (value) {
        try {
            return Boolean(JSON.parse(value));
        } catch {
            return false;
        }
    }

    return false;
}
