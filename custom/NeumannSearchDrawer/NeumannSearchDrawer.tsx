'use client';

import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { type FormEvent, type KeyboardEvent, useCallback, useEffect, useMemo, useRef } from 'react';

import { useRouting } from '@/adapters/client';
import { Button } from '@/components/Button';
import { IconClose, IconSearch } from '@/icons';

import styles from './NeumannSearchDrawer.module.scss';

interface Props {
    isOpen: boolean;
    localeCode: Locale.Code;
    onClose: () => void;
}

/**
 * Neumann-style search drawer.
 *
 * Drops down full-width from the top of the viewport (110px tall on desktop,
 * 60px on mobile) with a black translucent background and an orange bottom
 * border, matching <https://newsroom.neumann.com/>.
 *
 * Replaces the InstantSearch-based modal `<SearchWidget>` from the base theme.
 * Submitting the form navigates to the existing `/search?query=…` page —
 * there are no live in-drawer results (Q2 → A in NEUMANN_CUSTOMIZATION_PLAN.md).
 */
export function NeumannSearchDrawer({ isOpen, localeCode, onClose }: Props) {
    const router = useRouter();
    const { generateUrl } = useRouting();
    const inputRef = useRef<HTMLInputElement>(null);

    const searchPath = useMemo(
        () => generateUrl('search', { localeCode }),
        [generateUrl, localeCode],
    );

    // Auto-focus the input when the drawer opens; clear it when it closes.
    useEffect(() => {
        if (isOpen) {
            const id = window.setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => window.clearTimeout(id);
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        return undefined;
    }, [isOpen]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        },
        [onClose],
    );

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const query = String(formData.get('query') ?? '').trim();
            const target = query ? `${searchPath}?query=${encodeURIComponent(query)}` : searchPath;
            onClose();
            router.push(target);
        },
        [router, searchPath, onClose],
    );

    return (
        <div
            className={classNames(styles.drawer, { [styles.open]: isOpen })}
            aria-hidden={!isOpen}
            role="dialog"
            aria-modal={isOpen}
            aria-label="Search"
            onKeyDown={handleKeyDown}
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <IconSearch className={styles.icon} aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="search"
                    name="query"
                    className={styles.input}
                    placeholder="Search…"
                    autoComplete="off"
                    spellCheck={false}
                    tabIndex={isOpen ? 0 : -1}
                />
                <Button
                    type="button"
                    variation="navigation"
                    icon={IconClose}
                    className={styles.close}
                    onClick={onClose}
                    aria-label="Close search"
                    title="Close search"
                    tabIndex={isOpen ? 0 : -1}
                />
            </form>
        </div>
    );
}
