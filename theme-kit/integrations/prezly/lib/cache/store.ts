import { createMemoryStore, type Store } from '@e1himself/cached-fetch';

type Milliseconds = number;

export interface Options {
    ttl?: Milliseconds;
}

export function createSelfExpiringMemoryStore<T>({ ttl = 1000 }: Options = {}): Store<T> {
    const store = createMemoryStore<T>();
    const timers = new Map<string, ReturnType<typeof setTimeout>>();

    return {
        has(key) {
            return store.has(key);
        },
        get(key) {
            return store.get(key);
        },
        set(key, value, date?) {
            clearTimeout(timers.get(key));
            timers.set(
                key,
                setTimeout(() => store.del(key), ttl),
            );
            return store.set(key, value, date);
        },
        del(key) {
            clearTimeout(timers.get(key));
            return store.del(key);
        },
        clear() {
            timers.forEach((timeout) => clearTimeout(timeout));
            return store.clear();
        },
    };
}
