import { AnalyticsAdapter } from '@prezly/theme-kit-nextjs/adapters/server';

import { environment } from './environment';

export const { useAnalytics: analytics } = AnalyticsAdapter.connect({
    isTrackingEnabled: () => {
        const { PREZLY_MODE } = environment();
        return PREZLY_MODE !== 'preview';
    },
});
