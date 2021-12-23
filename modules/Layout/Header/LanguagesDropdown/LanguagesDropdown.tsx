import classNames from 'classnames';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useNewsroomContext } from '@/contexts/newsroom';
import {
    useCurrentLocale,
    useGetLinkLocaleSlug,
    useGetTranslationUrl,
    useLanguages,
    useSelectedStory,
} from '@/hooks';
import { IconGlobe } from '@/icons';
import { getLanguageDisplayName } from '@/utils/lang';
import { LocaleObject } from '@/utils/localeObject';
import { getUsedLanguages } from '@/utils/prezly/api/languages';

import styles from './LanguagesDropdown.module.scss';

type Props = {
    buttonClassName?: string;
    navigationItemClassName?: string;
};

const LanguagesDropdown: FunctionComponent<Props> = ({
    buttonClassName,
    navigationItemClassName,
}) => {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();
    const selectedStory = useSelectedStory();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    const { hasError } = useNewsroomContext();

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
                                selectedStory && translationLink !== '/'
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
};

export default LanguagesDropdown;
