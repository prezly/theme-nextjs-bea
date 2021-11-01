import { Category, Story } from '@prezly/sdk';
import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useLanguages } from '@/hooks/useLanguages';
import { useSelectedCategory } from '@/hooks/useSelectedCategory';
import { useSelectedStory } from '@/hooks/useSelectedStory';
import { IconGlobe } from '@/icons';
import { DEFAULT_LOCALE, getLanguageDisplayName } from '@/utils/lang';

import styles from './LanguagesDropdown.module.scss';
import { getCategoryHasTranslation, getCategoryUrl } from '@/utils/prezly';

const LanguagesDropdown: FunctionComponent = () => {
    const { locales, asPath } = useRouter();
    const currentLocale = useCurrentLocale();
    const newsroomLanguages = useLanguages();
    const selectedCategory = useSelectedCategory();
    const selectedStory = useSelectedStory();

    const displayedLocales = useMemo(() => {
        if (!locales?.length || !newsroomLanguages.length) {
            return [];
        }

        const supportedLocales = newsroomLanguages
            .filter((language) => language.stories_count > 0)
            .map((language) => language.locale.locale);

        return locales.filter((locale) => supportedLocales.includes(locale));
    }, [locales, newsroomLanguages]);

    // Determine correct URL for translated stories/categories with a fallback to homepage
    function getTranslationUrl(locale: string) {
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
    }

    // Don't show language selector if there are no other locale to choose
    if (displayedLocales.length < 2) {
        return null;
    }

    return (
        <Dropdown
            icon={IconGlobe}
            label={getLanguageDisplayName(currentLocale || DEFAULT_LOCALE)}
            menuClassName={styles.menu}
        >
            {displayedLocales.map((locale) => (
                <Dropdown.Item key={locale} href={getTranslationUrl(locale)} locale={locale}>
                    {getLanguageDisplayName(locale)}
                </Dropdown.Item>
            ))}
        </Dropdown>
    );
};

export default LanguagesDropdown;
