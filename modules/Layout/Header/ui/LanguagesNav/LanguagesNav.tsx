'use client';

import type { Culture } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl/build/cjs';

import type { Props as LanguageDropdownProps } from './LanguagesDropdown';
import { LanguagesDropdown } from './LanguagesDropdown';

interface Props extends Omit<LanguageDropdownProps, 'selected' | 'options'> {
    localeCode: Locale.Code;
    languages: Record<Locale.Code, Culture['native_name']>;
}

export function LanguagesNav({ languages, ...attributes }: Props) {
    const options: never[] = []; // FIXME
    const selected = options[0]; // FIXME

    if (!selected) {
        return null;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <LanguagesDropdown {...attributes} selected={selected} options={options} />;
}
