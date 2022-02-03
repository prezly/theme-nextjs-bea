import type { PrezlyEnv } from '@prezly/theme-kit-nextjs';

import type { AnalyticsJS } from '@/modules/analytics';

declare global {
    export namespace NodeJS {
        export interface ProcessEnv extends PrezlyEnv {
            NEXT_PUBLIC_HCAPTCHA_SITEKEY: string;
        }
    }

    interface Window {
        analytics: AnalyticsJS;
    }
}
