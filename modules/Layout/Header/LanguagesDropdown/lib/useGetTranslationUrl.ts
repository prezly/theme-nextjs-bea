import type { Category, Story } from '@prezly/sdk';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useSelectedCategory, useSelectedStory } from '@/hooks';
import { LocaleObject } from '@/utils/localeObject';
import { getCategoryHasTranslation, getCategoryUrl } from '@/utils/prezly';

// Determine correct URL for translated stories/categories with a fallback to homepage
function getTranslationUrl(
    locale: LocaleObject,
    path: string,
    selectedCategory?: Category,
    selectedStory?: Story,
) {
    if (selectedCategory) {
        if (getCategoryHasTranslation(selectedCategory, locale)) {
            return getCategoryUrl(selectedCategory, locale);
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

        return '/';
    }

    return path;
}

export default function useGetTranslationUrl() {
    const { asPath } = useRouter();
    const selectedCategory = useSelectedCategory();
    const selectedStory = useSelectedStory();

    return useCallback(
        (locale: LocaleObject) =>
            getTranslationUrl(locale, asPath, selectedCategory, selectedStory),
        [asPath, selectedCategory, selectedStory],
    );
}
