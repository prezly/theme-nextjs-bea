import type { Category, Story } from '@prezly/sdk';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { LocaleObject } from '@/utils';
import { getCategoryHasTranslation, getCategoryUrl } from '@/utils/prezly';

import { useSelectedCategory } from './useSelectedCategory';
import { useSelectedStory } from './useSelectedStory';

// Determine correct URL for translated stories/categories with a fallback to homepage
function getTranslationUrl(
    locale: LocaleObject,
    path: string,
    selectedCategory?: Category,
    selectedStory?: Story,
    noFallback?: boolean,
) {
    if (selectedCategory) {
        if (getCategoryHasTranslation(selectedCategory, locale)) {
            return getCategoryUrl(selectedCategory, locale);
        }

        if (noFallback) {
            return '';
        }

        return '/';
    }

    const localeCode = locale.toUnderscoreCode();

    if (selectedStory && selectedStory.culture.locale !== localeCode) {
        const translatedStory = selectedStory.translations.find(
            ({ culture }) => culture.locale === localeCode,
        );
        if (translatedStory) {
            return `/${translatedStory.slug}`;
        }

        if (noFallback) {
            return '';
        }

        return '/';
    }

    return path;
}

export function useGetTranslationUrl() {
    const { asPath } = useRouter();
    const selectedCategory = useSelectedCategory();
    const selectedStory = useSelectedStory();

    return useCallback(
        (locale: LocaleObject, noFallback?: boolean) =>
            getTranslationUrl(locale, asPath, selectedCategory, selectedStory, noFallback),
        [asPath, selectedCategory, selectedStory],
    );
}
