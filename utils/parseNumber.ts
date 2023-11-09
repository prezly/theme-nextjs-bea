export function parseNumber(value: string | null): number | undefined {
    if (value) {
        const number = Number(value);
        return !Number.isNaN(number) ? number : undefined;
    }
    return undefined;
}
