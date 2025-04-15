export function withoutUndefined<T extends Record<string, unknown>>(
    o: T,
): {
    [key in keyof T]: T[key] extends undefined ? never : T[key];
} {
    return Object.fromEntries(Object.entries(o).filter(([, value]) => value !== undefined)) as any;
}
