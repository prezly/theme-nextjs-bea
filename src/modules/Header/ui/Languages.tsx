'use client';

import type { Locale } from '@prezly/theme-kit-nextjs';
import { Intl } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useMemo } from 'react';

import { useBroadcastedTranslations } from '../../Broadcast';

import { CountryFlag } from './LanguagesDropdown/CountryFlag';
import { LanguagesDropdown } from './LanguagesDropdown';

import styles from './Languages.module.scss';

export function Languages({ selected, options, ...rest }: Languages.Props) {
    const broadcasted = useBroadcastedTranslations();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <these deps are likely to be recreated with each render, so we compare serialized values>
    const dropdownOptions = useMemo(() => {
        const displayedOptions = options.filter(
            (option) => option.code === selected || broadcasted[option.code] || option.stories > 0,
        );
        return withHrefOverrides(withShortenedTitles(displayedOptions), broadcasted);
    }, [JSON.stringify(options), JSON.stringify(selected), JSON.stringify(broadcasted)]);

    // Single locale: show a static flag to identify the market; no dropdown needed.
    if (dropdownOptions.length === 1) {
        const onlyOption = dropdownOptions[0];
        if (!onlyOption.countryCode) return null;
        return (
            <li className={rest.navigationItemClassName}>
                <span
                    className={classNames(rest.buttonClassName, styles.staticLocale)}
                    title={onlyOption.title}
                >
                    <CountryFlag
                        countryCode={onlyOption.countryCode}
                        countryName={onlyOption.title}
                        sizeClassName={styles.staticFlag}
                    />
                </span>
            </li>
        );
    }

    if (dropdownOptions.length < 2) {
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
            countryCode: option.countryCode,
        }))
        .map(
            (locale, _, locales): LanguagesDropdown.Option => ({
                code: locale.code,
                href: locale.href,
                countryCode: locale.countryCode,
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
