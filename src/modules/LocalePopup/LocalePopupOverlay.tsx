'use client';

import type { Locale } from '@prezly/theme-kit-nextjs';
import UploadcareImage from '@uploadcare/nextjs-loader';
import { useCallback, useEffect, useRef, useState } from 'react';

import { IconClose } from '@/icons';

import { CountryFlag } from '../Header/ui/LanguagesDropdown/CountryFlag';

import styles from './LocalePopup.module.scss';

const STORAGE_KEY = 'locale-popup-dismissed';

export interface LocaleOption {
    code: Locale.Code;
    title: string;
    href: string;
    countryCode: string | null;
}

interface Props {
    options: LocaleOption[];
    currentLocale: Locale.Code;
    logoSrc: string | null;
    newsroomName: string;
}

export function LocalePopupOverlay({ options, currentLocale, logoSrc, newsroomName }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setIsVisible(true);
        }
    }, []);

    const dismiss = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, '1');
        setIsVisible(false);
    }, []);

    // Close on Escape key
    useEffect(() => {
        if (!isVisible) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') dismiss();
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isVisible, dismiss]);

    // Focus the dialog when opened
    useEffect(() => {
        if (isVisible) dialogRef.current?.focus();
    }, [isVisible]);

    function handleOptionClick() {
        localStorage.setItem(STORAGE_KEY, '1');
        setIsVisible(false);
    }

    if (!isVisible) return null;

    return (
        <>
            {/* role="none" — purely visual backdrop; keyboard users dismiss via Escape */}
            <div role="none" className={styles.backdrop} onClick={dismiss} />

            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Choose your region"
                tabIndex={-1}
                className={styles.popup}
            >
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={dismiss}
                    aria-label="Close"
                >
                    <IconClose width={16} height={16} />
                </button>

                <div className={styles.header}>
                    <p className={styles.welcomeText}>Welcome to</p>

                    <div className={styles.logoWrapper}>
                        {logoSrc ? (
                            <UploadcareImage
                                src={logoSrc}
                                alt={newsroomName}
                                className={styles.logo}
                                width={360}
                                height={144}
                                style={{ objectFit: 'contain' }}
                            />
                        ) : (
                            <span className={styles.newsroomName}>{newsroomName}</span>
                        )}
                    </div>

                    <p className={styles.chooseText}>Choose your region</p>
                </div>

                <ul className={styles.options}>
                    {options.map((option) => (
                        <li key={option.code} className={styles.optionItem}>
                            <a
                                href={option.href}
                                className={styles.optionLink}
                                data-active={option.code === currentLocale || undefined}
                                onClick={handleOptionClick}
                            >
                                {option.countryCode && (
                                    <CountryFlag
                                        countryCode={option.countryCode}
                                        countryName={option.title}
                                        sizeClassName={styles.optionFlag}
                                    />
                                )}
                                <span className={styles.optionLabel}>
                                    {getShortTitle(option.code)}
                                </span>
                                {option.code === currentLocale && (
                                    <span className={styles.currentBadge} aria-hidden>
                                        ✓
                                    </span>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derive a short, single-word label for a locale option card.
 * Always uses the language name (e.g. "Dutch", "French", "English") so labels
 * are brief and the large flag communicates the country context.
 */
function getShortTitle(code: string): string {
    const langCode = code.trim().toLowerCase().replace('_', '-').split('-')[0];
    try {
        const name = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode);
        if (name && name !== langCode) return name;
    } catch {
        // Intl unavailable — fall back to raw code
    }
    return code;
}
