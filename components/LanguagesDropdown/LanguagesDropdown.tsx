import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useLanguages } from '@/hooks/useLanguages';
import { IconGlobe } from '@/icons';
import { DEFAULT_LOCALE, getLanguageDisplayName } from '@/utils/lang';
import { fromSlug, toSlug } from '@/utils/locale';

import { useGetTranslationUrl } from './lib';

import styles from './LanguagesDropdown.module.scss';

const LanguagesDropdown: FunctionComponent = () => {
    const { locales: localeSlugs } = useRouter();
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();

    const displayedLocaleSlugs = useMemo(() => {
        if (!localeSlugs?.length || !languages.length) {
            return [];
        }

        const nonEmptyLocaleSlugs = languages
            .filter((language) => language.stories_count > 0)
            .map((language) => toSlug(language.code));

        return localeSlugs.filter((localeSlug) => nonEmptyLocaleSlugs.includes(localeSlug));
    }, [localeSlugs, languages]);

    // Don't show language selector if there are no other locale to choose
    if (displayedLocaleSlugs.length < 2) {
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
            {displayedLocaleSlugs.map((localeSlug) => (
                <Dropdown.Item
                    key={localeSlug}
                    href={getTranslationUrl(fromSlug(localeSlug))}
                    // TODO: do not append the locale to URL when navigating to default language
                    locale={localeSlug}
                    forceRefresh
                    className={styles.item}
                >
                    {getLanguageDisplayName(fromSlug(localeSlug))}
                </Dropdown.Item>
            ))}
        </Dropdown>
    );
};

export default LanguagesDropdown;
