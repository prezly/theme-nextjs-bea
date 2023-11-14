import { headers } from 'next/headers';

export function integrateAppHelper<T>(createAppHelper: () => T) {
    type Headers = ReturnType<typeof headers>;
    type AppHelper = ReturnType<typeof createAppHelper>;

    const INSTANCES = new WeakMap<Headers, AppHelper>();

    function useApp() {
        const key = headers();
        const cached = INSTANCES.get(key);
        const instance = cached ?? createAppHelper();

        if (!cached) {
            INSTANCES.set(key, instance);
        }

        return instance;
    }

    return { useApp };
}
