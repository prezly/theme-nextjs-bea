import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useSelectedCategory } from '@/hooks/useSelectedCategory';
import { useSelectedStory } from '@/hooks/useSelectedStory';
import { getCategoryHasTranslation, getCategoryUrl } from '@/utils/prezly';

export default function useGetTranslationUrl() {
    const { asPath } = useRouter();
    const selectedCategory = useSelectedCategory();
    const selectedStory = useSelectedStory();

    // Determine correct URL for translated stories/categories with a fallback to homepage
    const getTranslationUrl = useCallback(
        (locale: string) => {
            if (selectedCategory) {
                if (getCategoryHasTranslation(selectedCategory, locale)) {
                    return getCategoryUrl(selectedCategory, locale);
                }

                return '/';
            }

            if (selectedStory && selectedStory.culture.locale !== locale) {
                const translatedStory = selectedStory.translations.find(
                    ({ culture }) => culture.locale === locale,
                );
                if (translatedStory) {
                    return `/${translatedStory.slug}`;
                }

                return '/';
            }

            return asPath;
        },
        [asPath, selectedCategory, selectedStory],
    );

    return getTranslationUrl;
}
