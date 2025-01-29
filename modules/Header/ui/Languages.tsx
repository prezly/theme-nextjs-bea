'use client';

import type { Locale } from '@prezly/theme-kit-nextjs';
import { Intl } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';

import { useBroadcastedTranslations } from '../../Broadcast';

import { LanguagesDropdown } from './LanguagesDropdown';

export function Languages({ selected, options, ...rest }: Languages.Props) {
    const broadcasted = useBroadcastedTranslations();

    const dropdownOptions = useMemo(() => {
        const displayedOptions = options.filter(
            (option) => option.code === selected || broadcasted[option.code] || option.stories > 0,
        );
        return withHrefOverrides(withShortenedTitles(displayedOptions), broadcasted);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options), JSON.stringify(selected), JSON.stringify(broadcasted)]);

    if (dropdownOptions.length <= 1) {
        return null;
    }

    return <LanguagesDropdown {...rest} options={dropdownOptions} selected={selected} />;
}

export namespace Languages {
    export interface Option extends LanguagesDropdown.Option {
        stories: number;
    }
    export interface Props extends LanguagesDropdown.Props {
        options: Option[];
    }
}

function withShortenedTitles(options: Languages.Option[]): LanguagesDropdown.Option[] {
    return options
        .map((option) => ({
            code: option.code,
            native_name: option.title,
            href: option.href,
        }))
        .map(
            (locale, _, locales): LanguagesDropdown.Option => ({
                code: locale.code,
                href: locale.href,
                title: Intl.getLanguageDisplayName(locale, locales),
            }),
        );
}

function withHrefOverrides(
    options: LanguagesDropdown.Option[],
    overrides: Record<Locale.Code, string | undefined>,
): LanguagesDropdown.Option[] {
    return options.map((option) => ({
        ...option,
        href: overrides[option.code] ?? option.href,
    }));
}
