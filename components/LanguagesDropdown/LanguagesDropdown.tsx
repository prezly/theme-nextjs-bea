import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { IconGlobe } from '@/icons';
import {
    DEFAULT_LOCALE,
    getLanguageDisplayName,
    getPrezlyLocaleCode,
    getSupportedLocaleCode,
} from '@/utils/lang';

import styles from './LanguagesDropdown.module.scss';

const LanguagesDropdown: FunctionComponent = () => {
    const { locale: currentLocale, locales, asPath } = useRouter();

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

    if (!availableLocales.length) {
        return null;
    }

    return (
        <Dropdown
            icon={IconGlobe}
            label={getLanguageDisplayName(currentLocale || DEFAULT_LOCALE)}
            menuClassName={styles.menu}
        >
            {availableLocales.map((locale) => (
                <Dropdown.Item key={locale} href={asPath} locale={getPrezlyLocaleCode(locale)}>
                    {getLanguageDisplayName(locale)}
                </Dropdown.Item>
            ))}
        </Dropdown>
    );
};

export default LanguagesDropdown;
