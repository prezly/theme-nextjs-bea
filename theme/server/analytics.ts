import { integrateAnalytics } from '@/theme-kit/server';

import { environment } from './environment';

export const { useAnalytics: analytics } = integrateAnalytics({
    isTrackingEnabled: () => {
        const { PREZLY_MODE } = environment();
        return PREZLY_MODE !== 'preview';
    },
});
