import type { Category, NewsroomLanguageSettings } from '@prezly/sdk';
import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';

export type AppHelper = ReturnType<typeof createAppHelper>;

export function createAppHelper(
    contentDelivery: ContentDelivery.Client,
    activeLocale: Locale.Code,
) {
    function story(params: ContentDelivery.story.SearchParams) {
        return contentDelivery.story(params);
    }

    function stories(params: ContentDelivery.stories.SearchParams) {
        return contentDelivery.stories(params, { include: ['thumbnail_image'] });
    }

    function allStories(params?: ContentDelivery.allStories.SearchParams) {
        return contentDelivery.allStories(params, { include: ['thumbnail_image'] });
    }

    function language(): Promise<NewsroomLanguageSettings>;
    function language(localeCode: Locale.Code): Promise<NewsroomLanguageSettings | undefined>;
    function language(localeCode?: Locale.Code): Promise<NewsroomLanguageSettings | undefined>;
    function language(localeCode?: Locale.Code) {
        if (localeCode) {
            return contentDelivery.language(localeCode);
        }
        return contentDelivery.languageOrDefault(activeLocale);
    }

    return {
        ...contentDelivery,
        timezone: () => contentDelivery.newsroom().then((newsroom) => newsroom.timezone),
        story,
        language,
        languageOrDefault(localeCode?: Locale.Code) {
            return contentDelivery.languageOrDefault(localeCode ?? activeLocale);
        },
        translatedCategories(localeCode?: Locale.Code, categories?: Category[]) {
            return contentDelivery.translatedCategories(localeCode ?? activeLocale, categories);
        },
        notifications() {
            return contentDelivery.notifications(activeLocale);
        },
        stories,
        allStories,
        preload() {
            contentDelivery.languages();
            contentDelivery.newsroom();
        },
    };
}
