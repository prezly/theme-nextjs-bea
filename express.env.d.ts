import type { Newsroom, NewsroomLanguageSettings } from '@prezly/sdk';
import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';

import type { Environment } from './remix/environment';
import type { AppRouter } from './remix/routing';

declare global {
    namespace Express {
        interface Locals {
            /**
             * Environment variables initialized from process.env & HTTP Env Header
             */
            env: Environment;

            /**
             * Prezly API client initialized from the above environment.
             */
            contentDelivery: ContentDelivery.Client;

            /**
             * Prezly Newsroom common data fetched with the above `contentDelivery` client.
             */
            newsroom: Newsroom;
            languages: NewsroomLanguageSettings[];
            defaultLanguage: NewsroomLanguageSettings;
            locales: Locale.Code[];
            defaultLocale: Locale.Code;

            /**
             * App routing initialized for the current newsroom (with `locales` & `defaultLocale` taken into account)
             */
            routing: AppRouter;
            /**
             * Matched request locale.
             */
            locale: Locale.Code;
        }
    }
}
