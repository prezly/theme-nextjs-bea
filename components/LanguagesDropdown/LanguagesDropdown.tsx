import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useLanguages } from '@/hooks/useLanguages';
import { IconGlobe } from '@/icons';
import { DEFAULT_LOCALE, getLanguageDisplayName } from '@/utils/lang';

import styles from './LanguagesDropdown.module.scss';

const LanguagesDropdown: FunctionComponent = () => {
    const currentLocale = useCurrentLocale();
    const { locales, asPath } = useRouter();
    const newsroomLanguages = useLanguages();

    const displayedLocales = useMemo(() => {
        if (!locales?.length || !newsroomLanguages.length) {
            return [];
        }

        const supportedLocales = newsroomLanguages
            .filter((language) => language.stories_count > 0)
            .map((language) => language.locale.locale);

        return locales.filter((locale) => supportedLocales.includes(locale));
    }, [locales, newsroomLanguages]);

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
                <Dropdown.Item key={locale} href={asPath} locale={locale}>
                    {getLanguageDisplayName(locale)}
                </Dropdown.Item>
            ))}
        </Dropdown>
    );
};

export default LanguagesDropdown;
