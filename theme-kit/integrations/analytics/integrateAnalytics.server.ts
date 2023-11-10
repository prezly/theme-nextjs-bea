import { type Resolvable, resolvable } from '@/theme-kit/resolvable';

interface Configuration {
    isTrackingEnabled: Resolvable<boolean>;
}

export function integrateAnalytics(config: Configuration) {
    const resolveTrackingEnabled = resolvable(config.isTrackingEnabled);

    function useAnalytics() {
        return {
            isTrackingEnabled: resolveTrackingEnabled(),
        };
    }

    return { useAnalytics };
}
