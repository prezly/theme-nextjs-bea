import type { Newsroom, NewsroomLanguageSettings } from '@prezly/sdk';
import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';

import type { AppHelper } from './app-helper';
import type { Environment } from './environment';
import type { AppRouter } from './routing';
import type { ThemeSettings } from './theme-settings';

export interface RequestContext {
    /**
     * Convenience wrapper around ContentDelivery client, bound to the current request locale.
     */
    app: AppHelper;

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
    themeSettings: ThemeSettings;
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
