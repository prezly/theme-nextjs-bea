import type { AnalyticsJS } from '@/modules/analytics';

import { Env } from '../types';

declare global {
    export namespace NodeJS {
        export interface ProcessEnv extends Env {}
    }

    interface Window {
        analytics: AnalyticsJS;
    }
}
