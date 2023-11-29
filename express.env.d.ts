import type { Newsroom, NewsroomLanguageSettings } from '@prezly/sdk';
import type { ContentDelivery } from '@prezly/theme-kit-nextjs';

import type { Environment } from './remix/environment';

declare global {
    namespace Express {
        interface Locals {
            env: Environment;

            contentDelivery: ReturnType<typeof ContentDelivery.createClient>;

            newsroom: Newsroom;
            languages: NewsroomLanguageSettings[];
            defaultLanguage: NewsroomLanguageSettings;
        }
    }
}
