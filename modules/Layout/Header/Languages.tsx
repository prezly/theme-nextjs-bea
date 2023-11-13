import { getLanguageDisplayName } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { api } from '@/theme/server';
import { locale } from '@/theme/server/locale';

import type { LanguageVersions } from './types';
import { type LanguageOption, LanguagesDropdown } from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    languageVersions: LanguageVersions;
}

export async function Languages({ languageVersions }: Props) {
    const localeCode = locale();
    const { contentDelivery } = api();

    const languages = await contentDelivery.languages();

    const titles = Object.fromEntries(
        languages.map((lang) => [lang.code, lang.locale.native_name]),
    );

    const displayedLanguages = languages.filter(
        (lang) => lang.public_stories_count > 0 || lang.code === localeCode,
    );

    const options: LanguageOption[] = displayedLanguages
        .map((lang): LanguageOption | undefined => {
            const href = languageVersions[lang.code];

            if (typeof href === 'undefined') return undefined;

            return {
                code: lang.code,
                href,
                title: getLanguageDisplayName(lang, displayedLanguages),
            };
        })
        .filter(isNotUndefined)
        .sort((a, b) => a.title.localeCompare(b.title));

    return (
        <LanguagesDropdown
            selected={localeCode}
            options={options}
            buttonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
        >
            {titles[localeCode]}
        </LanguagesDropdown>
    );
}
