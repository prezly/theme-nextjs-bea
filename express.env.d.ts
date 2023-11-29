import type { Newsroom, NewsroomLanguageSettings } from '@prezly/sdk';

import type { Environment } from './remix/environment';
import type { AppRouter } from './remix/routing';
import type { ContentDeliveryClient } from './remix/types';

declare global {
    namespace Express {
        interface Locals {
            env: Environment;

            contentDelivery: ContentDeliveryClient;

            newsroom: Newsroom;
            languages: NewsroomLanguageSettings[];
            defaultLanguage: NewsroomLanguageSettings;

            routing: AppRouter;
        }
    }
}
