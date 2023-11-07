'use client';

import type { Culture } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';
import { isNotUndefined } from '@technically/is-not-undefined';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { Props as LanguageDropdownProps } from './LanguagesDropdown';
import { LanguagesDropdown } from './LanguagesDropdown';
import type { LanguageDisplayProps } from './types';

interface Props extends Omit<LanguageDropdownProps, 'selected' | 'options'> {
    localeCode: Locale.Code;
    languages: Record<Locale.Code, Culture['native_name']>;
}

interface State {
    options: LanguageDisplayProps[];
    selected: LanguageDisplayProps | undefined;
}

export function LanguagesNav({ localeCode, languages, ...attributes }: Props) {
    const [mounted, setMounted] = useState(false);
    const [{ options, selected }, setState] = useState<State>({
        options: [],
        selected: {
            code: localeCode,
            title: languages[localeCode],
            href: '',
        },
    });
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const languageOptions: LanguageDisplayProps[] = Array.from(
            document.head.querySelectorAll('link[rel="alternate"]'),
        )
            .filter((link) => link instanceof HTMLLinkElement)
            .map((link) => {
                if (link instanceof HTMLLinkElement && Locale.isValid(link.hreflang)) {
                    const { code } = Locale.from(link.hreflang);
                    const { href } = link;
                    const title = languages[code];

                    if (title) {
                        return { code, href, title };
                    }
                }
                return undefined;
            })
            .filter(isNotUndefined);

        const selectedLanguage = options.find((option) => option.code === localeCode);

        setState({
            options: languageOptions,
            selected: selectedLanguage,
        });
    }, [mounted, pathname]);

    if (!selected) {
        return null;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <LanguagesDropdown {...attributes} selected={selected} options={options} />;
}
