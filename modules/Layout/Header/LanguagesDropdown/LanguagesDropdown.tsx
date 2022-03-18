import {
    getLanguageDisplayName,
    getLocaleDirection,
    getUsedLanguages,
    LocaleObject,
    useCurrentLocale,
    useCurrentStory,
    useGetLinkLocaleSlug,
    useGetTranslationUrl,
    useLanguages,
} from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useEffect, useMemo } from 'react';

import { Dropdown } from '@/components';
import { IconGlobe } from '@/icons';

import styles from './LanguagesDropdown.module.scss';

type Props = {
    buttonClassName?: string;
    navigationItemClassName?: string;
    hasError?: boolean;
};

function LanguagesDropdown({ buttonClassName, navigationItemClassName, hasError }: Props) {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();
    const currentStory = useCurrentStory();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    const currentLanguage = useMemo(
        () => languages.find((language) => language.code === currentLocale.toUnderscoreCode()),
        [currentLocale, languages],
    );

    const displayedLanguages = useMemo(() => {
        if (!languages.length) {
            return [];
        }

        return getUsedLanguages(languages).filter(
            (language) => language.code !== currentLocale.toUnderscoreCode(),
        );
    }, [currentLocale, languages]);

    // Dynamically update the language attributes on `html` and `meta` tags when changing language.
    useEffect(() => {
        const htmlElement = document.querySelector('html');

        if (!htmlElement) {
            return;
        }

        // TODO: The direction can be pulled from the Language object
        const direction = getLocaleDirection(currentLocale);
        const localeCode = currentLocale.toHyphenCode();

        htmlElement.setAttribute('dir', direction);
        htmlElement.setAttribute('lang', localeCode);

        const metaTag = document.querySelector('meta[name="og:locale"]');
        if (metaTag) {
            metaTag.setAttribute('content', localeCode);
        }
    }, [currentLocale]);

    // Don't show language selector if there are no other locale to choose
    if (!currentLanguage || displayedLanguages.length < 1) {
        return null;
    }

    return (
        <li className={navigationItemClassName}>
            <Dropdown
                icon={IconGlobe}
                label={getLanguageDisplayName(currentLanguage, languages)}
                className={styles.container}
                menuClassName={styles.menu}
                buttonClassName={classNames(buttonClassName, styles.button)}
                withMobileDisplay
            >
                {displayedLanguages.map((language) => {
                    const locale = LocaleObject.fromAnyCode(language.code);
                    const translationLink = hasError ? '/' : getTranslationUrl(locale);

                    return (
                        <Dropdown.Item
                            key={locale.toHyphenCode()}
                            href={translationLink}
                            localeCode={
                                currentStory && translationLink !== '/'
                                    ? false
                                    : getLinkLocaleSlug(locale)
                            }
                            forceRefresh
                            withMobileDisplay
                        >
                            {getLanguageDisplayName(language, languages)}
                        </Dropdown.Item>
                    );
                })}
            </Dropdown>
        </li>
    );
}

export default LanguagesDropdown;
