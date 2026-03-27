'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { analytics } from '@/utils';

import { CountryFlag } from './CountryFlag';
import styles from './LanguagesDropdown.module.scss';

export function LanguagesDropdown({
    selected,
    options,
    buttonClassName,
    navigationItemClassName,
}: LanguagesDropdown.Props) {
    const selectedOption = options.find((option) => option.code === selected);

    const displayedOptions = [...options].sort((a, b) => a.title.localeCompare(b.title));

    const buttonLabel = (
        <span className={styles.buttonContent}>
            {selectedOption?.countryCode && (
                <CountryFlag
                    countryCode={selectedOption.countryCode}
                    countryName={selectedOption.title}
                    sizeClassName={styles.buttonFlag}
                />
            )}
            {selectedOption && (
                <span className={styles.buttonText}>
                    {getButtonText(selectedOption.code) ?? selectedOption.title}
                </span>
            )}
        </span>
    );

    return (
        <li className={navigationItemClassName}>
            <Dropdown
                label={buttonLabel}
                menuClassName={styles.menu}
                buttonClassName={classNames(buttonClassName, styles.button)}
                withMobileDisplay
            >
                {displayedOptions.map(({ code, href, title, countryCode }) => (
                    <DropdownItem
                        key={code}
                        href={href}
                        withMobileDisplay
                        linkClassName={styles.languageLink}
                        className={classNames({
                            [styles.disabled]: code === selected,
                        })}
                        onClick={() => analytics.track(ACTIONS.SWITCH_LANGUAGE, { code })}
                    >
                        {countryCode && (
                            <CountryFlag
                                countryCode={countryCode}
                                countryName={title}
                                sizeClassName={styles.flagItem}
                            />
                        )}
                        <span className={styles.languageLabel}>{title}</span>
                    </DropdownItem>
                ))}
            </Dropdown>
        </li>
    );
}

export namespace LanguagesDropdown {
    export interface Option {
        code: Locale.Code;
        title: string;
        href: string;
        countryCode: string | null;
    }

    export interface Props {
        selected?: Option['code'];
        options: Option[];
        buttonClassName?: string;
        navigationItemClassName?: string;
    }
}

// ─── Button label helpers ─────────────────────────────────────────────────────

/**
 * Compute a short, contextually appropriate label for the language-picker button.
 *
 * Logic (based on locale code structure):
 *
 *   2-letter code  (e.g. "nl", "en")
 *     → The code represents a single country/language unit.
 *       Show the region name so it matches the flag (e.g. "Netherlands").
 *       Special mappings (en → gb) are already reflected in countryCode, but
 *       here we resolve the display label from the language-to-region table too.
 *
 *   4-letter, lang == country  (e.g. "nl-NL", "de-DE")
 *     → Language and market are identical.
 *       Show the country/region name only (e.g. "Netherlands").
 *
 *   4-letter, lang ≠ country  (e.g. "nl-BE", "fr-BE")
 *     → Multiple language variants exist for the same country.
 *       Show the language name so users can tell them apart (e.g. "Dutch", "French").
 *
 * Returns null if the code is non-standard or Intl resolution fails,
 * so the caller can fall back to the full title.
 */
function getButtonText(code: string): string | null {
    const normalized = code.trim().toLowerCase().replace('_', '-');
    const parts = normalized.split('-').filter(Boolean);

    try {
        if (parts.length === 1) {
            // 2-letter language-only code → resolve to region name via the same
            // mapping used for flags (e.g. en → gb → "United Kingdom", nl → "Netherlands")
            const regionCode = LANGUAGE_TO_REGION[parts[0]] ?? parts[0];
            if (regionCode.length === 2) {
                const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(
                    regionCode.toUpperCase(),
                );
                if (name && name !== regionCode.toUpperCase()) return name;
            }
            // Fallback: language display name
            const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(parts[0]);
            return langName && langName !== parts[0] ? langName : null;
        }

        if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 2) {
            const [lang, region] = parts;
            if (lang === region) {
                // e.g. nl-NL → "Netherlands"
                const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(
                    region.toUpperCase(),
                );
                return name && name !== region.toUpperCase() ? name : null;
            }
            // e.g. nl-BE → "Dutch", fr-BE → "French"
            const name = new Intl.DisplayNames(['en'], { type: 'language' }).of(lang);
            return name && name !== lang ? name : null;
        }
    } catch {
        // Intl not available or invalid code — caller falls back to full title
    }

    return null;
}

// Mirror of the mapping in localeDisplay.ts — kept local to avoid importing
// a utils file just for one lookup (and to stay self-contained in this module).
const LANGUAGE_TO_REGION: Record<string, string> = {
    lb: 'lu',
    sq: 'al',
    cnr: 'me',
    ca: 'ad',
    bs: 'ba',
    en: 'gb',
};
