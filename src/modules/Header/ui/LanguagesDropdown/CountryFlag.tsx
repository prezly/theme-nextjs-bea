'use client';

import classNames from 'classnames';

import { FlagIcons, type IconComponentType } from '@/icons';

import styles from './LanguagesDropdown.module.scss';

interface Props {
    countryCode: string;
    countryName: string;
    /**
     * Size class to apply to the wrapper alongside the base `.flagWrapper`.
     * Must set `width` and `height`. Required — there is intentionally no
     * default size on `.flagWrapper` to avoid CSS-modules insertion-order conflicts.
     */
    sizeClassName: string;
}

/**
 * Renders a country flag SVG inside a fixed-ratio wrapper.
 * Returns null silently when no flag exists for the given country code.
 */
export function CountryFlag({ countryCode, countryName, sizeClassName }: Props) {
    const flagKey = `Flag${countryCode.toUpperCase()}` as keyof typeof FlagIcons;
    const FlagIcon = FlagIcons[flagKey] as IconComponentType | undefined;

    if (!FlagIcon) return null;

    return (
        <span className={classNames(styles.flagWrapper, sizeClassName)} aria-hidden>
            <FlagIcon className={styles.flag} aria-label={`${countryName} flag`} />
        </span>
    );
}
