import { getLanguageDisplayName, getUsedLanguages, useLanguages } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';

export function useDisplayedLanguages() {
    const languages = useLanguages();
    return useMemo(() => {
        if (!languages.length) {
            return [];
        }

        return getUsedLanguages(languages).sort((a, b) =>
            getLanguageDisplayName(a, languages).localeCompare(
                getLanguageDisplayName(b, languages),
            ),
        );
    }, [languages]);
}
