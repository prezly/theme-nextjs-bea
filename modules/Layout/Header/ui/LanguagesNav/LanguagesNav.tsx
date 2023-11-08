'use client';

import type { Culture } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { isNotUndefined } from '@technically/is-not-undefined';
import { useMemo } from 'react';

import { useLanguageVersions } from '@/theme-kit/language-versions';

import type { Props as LanguageDropdownProps } from './LanguagesDropdown';
import { LanguagesDropdown } from './LanguagesDropdown';

interface Props extends Omit<LanguageDropdownProps, 'selected' | 'options'> {
    localeCode: Locale.Code;
    languages: Record<Locale.Code, Culture['native_name']>;
}

export function LanguagesNav({ localeCode, languages, ...attributes }: Props) {
    const versions = useLanguageVersions();

    const options = useMemo(
        () =>
            Object.entries(versions)
                .map(([code, href]) => {
                    if (href) {
                        return {
                            code: code as Locale.Code,
                            title: languages[code as Locale.Code] ?? code,
                            href,
                        };
                    }
                    return undefined;
                })
                .filter(isNotUndefined),
        [versions],
    );

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <LanguagesDropdown {...attributes} selected={localeCode} options={options}>
            {languages[localeCode]}
        </LanguagesDropdown>
    );
}
