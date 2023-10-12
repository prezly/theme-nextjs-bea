export async function asyncShape<T extends Record<string, () => Promise<unknown>>>(map: T) {
    const entries = Object.entries(map);
    const values = await Promise.all(
        entries.map(async ([name, callback]) => ({ [name]: await callback() })),
    );
    return values.reduce((agg, value) => ({ ...agg, ...value }), {}) as {
        [K in keyof T]: T[K] extends () => Promise<infer R> ? R : never;
    };
}
