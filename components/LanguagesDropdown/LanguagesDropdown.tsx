import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useLanguages } from '@/hooks/useLanguages';
import { IconGlobe } from '@/icons';
import {
    DEFAULT_LOCALE,
    getLanguageDisplayName,
    getPrezlyLocaleCode,
    getSupportedLocaleCode,
} from '@/utils/lang';
import { convertToBrowserFormat, getShortLocale } from '@/utils/localeTransform';

import styles from './LanguagesDropdown.module.scss';

const LanguagesDropdown: FunctionComponent = () => {
    const { locale: currentLocale, locales, asPath } = useRouter();
    const newsroomLanguages = useLanguages();

    const availableLocales = useMemo(() => {
        if (!locales || !locales.length) {
            return [];
        }

        return [
            ...new Set(
                locales
                    .map((locale) => getSupportedLocaleCode(locale))
                    .filter<string>(Boolean as any),
            ),
        ];
    }, [locales]);

    const displayedLocales = useMemo(() => {
        if (!availableLocales.length || !newsroomLanguages.length) {
            return [];
        }

        const supportedLocales = newsroomLanguages
            .filter((language) => language.stories_count > 0)
            .map((language) => convertToBrowserFormat(language.locale.locale));
        // Allow fallback to general locale
        // TODO: Add regional locales
        const supportedLocalesShortCodes = supportedLocales
            .map((locale) => getShortLocale(locale))
            .filter(Boolean);

        return availableLocales.filter(
            (locale) =>
                supportedLocales.includes(locale) || supportedLocalesShortCodes.includes(locale),
        );
    }, [availableLocales, newsroomLanguages]);

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
                <Dropdown.Item key={locale} href={asPath} locale={getPrezlyLocaleCode(locale)}>
                    {getLanguageDisplayName(locale)}
                </Dropdown.Item>
            ))}
        </Dropdown>
    );
};

export default LanguagesDropdown;
