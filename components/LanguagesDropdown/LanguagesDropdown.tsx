import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useLanguages } from '@/hooks/useLanguages';
import { IconGlobe } from '@/icons';
import { DEFAULT_LOCALE, getLanguageDisplayName } from '@/utils/lang';

import { useGetTranslationUrl } from './lib';

import styles from './LanguagesDropdown.module.scss';

const LanguagesDropdown: FunctionComponent = () => {
    const { locales } = useRouter();
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();

    const displayedLocales = useMemo(() => {
        if (!locales?.length || !languages.length) {
            return [];
        }

        const supportedLocales = languages
            .filter((language) => language.stories_count > 0)
            .map((language) => language.code);

        return locales.filter((locale) => supportedLocales.includes(locale));
    }, [locales, languages]);

    // Don't show language selector if there are no other locale to choose
    if (displayedLocales.length < 2) {
        return null;
    }

    return (
        <Dropdown
            icon={IconGlobe}
            label={
                <span className={styles.label}>
                    {getLanguageDisplayName(currentLocale || DEFAULT_LOCALE)}
                </span>
            }
            menuClassName={styles.menu}
        >
            {displayedLocales.map((locale) => (
                <Dropdown.Item
                    key={locale}
                    href={getTranslationUrl(locale)}
                    locale={locale}
                    forceRefresh
                    className={styles.item}
                >
                    {getLanguageDisplayName(locale)}
                </Dropdown.Item>
            ))}
        </Dropdown>
    );
};

export default LanguagesDropdown;
