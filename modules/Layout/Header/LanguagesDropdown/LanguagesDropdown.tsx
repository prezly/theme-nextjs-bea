import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import Dropdown from '@/components/Dropdown';
import { useNewsroomContext } from '@/contexts/newsroom';
import { useCurrentLocale, useGetLinkLocale, useLanguages, useSelectedStory } from '@/hooks';
import { IconGlobe } from '@/icons';
import { DEFAULT_LOCALE, getLanguageDisplayName } from '@/utils/lang';
import { fromSlug, toIsoCode } from '@/utils/locale';
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
    const { locales: localeIsoCodes } = useRouter();
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();
    const selectedStory = useSelectedStory();
    const getLinkLocale = useGetLinkLocale();
    const { hasError } = useNewsroomContext();

    const displayedIsoLocaleCodes = useMemo(() => {
        if (!localeIsoCodes?.length || !languages.length) {
            return [];
        }

        const usedLocaleIsoCodes = getUsedLanguages(languages).map(({ code }) => toIsoCode(code));

        return localeIsoCodes.filter((locale) => usedLocaleIsoCodes.includes(locale)).map(fromSlug);
    }, [localeIsoCodes, languages]);

    // Don't show language selector if there are no other locale to choose
    if (displayedIsoLocaleCodes.length < 2) {
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
                {displayedIsoLocaleCodes.map((localeCode) => {
                    const translationLink = hasError ? '/' : getTranslationUrl(localeCode);

                    return (
                        <Dropdown.Item
                            key={localeCode}
                            href={translationLink}
                            localeCode={
                                selectedStory && translationLink !== '/'
                                    ? false
                                    : getLinkLocale(localeCode)
                            }
                            forceRefresh
                            withMobileDisplay
                        >
                            {getLanguageDisplayName(localeCode)}
                        </Dropdown.Item>
                    );
                })}
            </Dropdown>
        </li>
    );
};

export default LanguagesDropdown;
