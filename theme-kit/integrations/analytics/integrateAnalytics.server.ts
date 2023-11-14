import { type Resolvable, resolve } from '@/theme-kit/resolvable';

interface Configuration {
    isTrackingEnabled: Resolvable<boolean>;
}

export function integrateAnalytics(config: Configuration) {
    function useAnalytics() {
        return {
            isTrackingEnabled: resolve(config.isTrackingEnabled),
        };
    }

    return { useAnalytics };
}
