import { type AsyncResolvable, multiResolveAsync } from '@/theme-kit/resolvable';
import { withoutUndefined } from '@/utils';

interface Configuration<T> {
    defaults: AsyncResolvable<T>;
    settings: AsyncResolvable<Partial<T> | undefined>;
}

export function integrateThemeSettings<T>(config: Configuration<T>) {
    async function useThemeSettings(): Promise<T> {
        const [defaults, settings] = await multiResolveAsync([config.defaults, config.settings]);

        return {
            ...defaults,
            ...withoutUndefined(settings ?? {}),
        } as T;
    }

    return { useThemeSettings };
}
