import type { Category, Story } from '@prezly/sdk';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useSelectedCategory } from '@/hooks/useSelectedCategory';
import { useSelectedStory } from '@/hooks/useSelectedStory';
import { getCategoryHasTranslation, getCategoryUrl } from '@/utils/prezly';

// Determine correct URL for translated stories/categories with a fallback to homepage
function getTranslationUrl(
    localeCode: string,
    path: string,
    selectedCategory?: Category,
    selectedStory?: Story,
) {
    if (selectedCategory) {
        if (getCategoryHasTranslation(selectedCategory, localeCode)) {
            return getCategoryUrl(selectedCategory, localeCode);
        }

        return '/';
    }

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
        (localeCode: string) =>
            getTranslationUrl(localeCode, asPath, selectedCategory, selectedStory),
        [asPath, selectedCategory, selectedStory],
    );
}
