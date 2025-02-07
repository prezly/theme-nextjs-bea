export function parseArray<T>(
    value: string | undefined | null,
    typeCastFn: (item: string) => T,
): T[] | undefined {
    if (value && typeof value === 'string') {
        return value.split(',').map(typeCastFn);
    }

    return undefined;
}
