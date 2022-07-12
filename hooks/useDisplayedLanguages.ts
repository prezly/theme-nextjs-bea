import { getUsedLanguages, useCurrentLocale, useLanguages } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';

export function useDisplayedLanguages() {
    const languages = useLanguages();
    const currentLocale = useCurrentLocale();
    return useMemo(() => {
        if (!languages.length) {
            return [];
        }

        return getUsedLanguages(languages).filter(
            (language) => language.code !== currentLocale.toUnderscoreCode(),
        );
    }, [currentLocale, languages]);
}
