import LRU from 'lru-cache';

const CACHE_MAX_AGE_IN_S = 600; // 10 minutes

const cache = new LRU<string, any>({
    ttl: CACHE_MAX_AGE_IN_S * 1000,
    max: 50,
});

export default async function withCache<T>(
    key: string,
    callback: () => Promise<T>,
    bypass?: boolean,
): Promise<T> {
    if (bypass) {
        return callback();
    }

    if (cache.has(key)) {
        const cachedValue = cache.get(key) as T;
        if (cachedValue) {
            return cachedValue;
        }
    }

    const value = await callback();

    cache.set(key, value);

    return value;
}

export function makeCacheKey(base: string, value: string) {
    return `${base}_${value.toUpperCase().replace(' ', '_')}`;
}
