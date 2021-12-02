import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useCurrentLocale, useGetLinkLocale, useLanguages, useSelectedStory } from '@/hooks';
import { IconGlobe } from '@/icons';
import { DEFAULT_LOCALE, getLanguageDisplayName } from '@/utils/lang';
import { fromSlug, toSlug } from '@/utils/locale';
import { getUsedLanguages } from '@/utils/prezly/api/languages';

import { useGetTranslationUrl } from './lib';

import styles from './LanguagesDropdown.module.scss';

type Props = {
    buttonClassName?: string;
    navigationItemClassName?: string;
};

const LanguagesDropdown: FunctionComponent<Props> = ({
    buttonClassName,
    navigationItemClassName,
}) => {
    const { locales: localeSlugs } = useRouter();
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();
    const selectedStory = useSelectedStory();
    const getLinkLocale = useGetLinkLocale();

    const displayedLocaleSlugs = useMemo(() => {
        if (!localeSlugs?.length || !languages.length) {
            return [];
        }

        const nonEmptyLocaleSlugs = getUsedLanguages(languages).map((language) =>
            toSlug(language.code),
        );

        return localeSlugs.filter((locale) => nonEmptyLocaleSlugs.includes(locale));
    }, [localeSlugs, languages]);

    // Don't show language selector if there are no other locale to choose
    if (displayedLocaleSlugs.length < 2) {
        return null;
    }

    return (
        <li className={navigationItemClassName}>
            <Dropdown
                icon={IconGlobe}
                label={getLanguageDisplayName(currentLocale || DEFAULT_LOCALE)}
                className={styles.container}
                menuClassName={styles.menu}
                buttonClassName={classNames(buttonClassName, styles.button)}
                withMobileDisplay
            >
                {displayedLocaleSlugs.map((localeSlug) => (
                    <Dropdown.Item
                        key={localeSlug}
                        href={getTranslationUrl(fromSlug(localeSlug))}
                        locale={selectedStory ? false : getLinkLocale(localeSlug)}
                        forceRefresh
                        withMobileDisplay
                    >
                        {getLanguageDisplayName(fromSlug(localeSlug))}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </li>
    );
};

export default LanguagesDropdown;
