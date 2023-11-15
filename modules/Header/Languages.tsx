import { Intl } from '@prezly/theme-kit-nextjs';
import { isNotUndefined } from '@technically/is-not-undefined';

import { app } from '@/adapters/server';

import type { LanguageVersions } from './types';
import { type LanguageOption, LanguagesDropdown } from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    languageVersions: LanguageVersions;
}

export async function Languages({ languageVersions }: Props) {
    const localeCode = app().locale();
    const languages = await app().languages();

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
                title: Intl.getLanguageDisplayName(lang, displayedLanguages),
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
