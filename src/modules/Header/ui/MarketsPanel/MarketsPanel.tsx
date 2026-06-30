'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import { IconCaret, IconGlobe } from '@/icons';
import { analytics } from '@/utils';

import { useBroadcastedTranslations } from '../../../Broadcast';

import styles from './MarketsPanel.module.scss';

export interface LanguageOption {
    code: string;
    title: string;
    href: string;
}

export interface Market {
    countryName: string;
    newsroomUuid: string;
    isCurrent: boolean;
    languages: LanguageOption[];
}

interface Props {
    selected: Locale.Code;
    markets: Market[];
    buttonClassName?: string;
    navigationItemClassName?: string;
}

export function MarketsPanel({
    selected,
    markets,
    buttonClassName,
    navigationItemClassName,
}: Props) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const broadcasted = useBroadcastedTranslations();

    const currentMarket = markets.find((m) => m.isCurrent);
    const currentLanguage = useMemo(() => {
        for (const market of markets) {
            const match = market.languages.find((lang) => lang.code === selected);
            if (match) return match;
        }
        return undefined;
    }, [markets, selected]);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };
        const onClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                close();
            }
        };
        window.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onClick);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onClick);
        };
    }, [open, close]);

    function applyOverride(market: Market, lang: LanguageOption): string {
        if (!market.isCurrent) return lang.href;
        return broadcasted[lang.code as Locale.Code] ?? lang.href;
    }

    function onSelect(code: string) {
        analytics.track(ACTIONS.SWITCH_LANGUAGE, { code });
        close();
    }

    return (
        <li className={navigationItemClassName}>
            <div ref={containerRef} className={styles.container}>
                <Button
                    variation="navigation"
                    icon={IconCaret}
                    iconPlacement="right"
                    className={classNames(buttonClassName, styles.trigger, {
                        [styles.rotateCaret]: open,
                    })}
                    onClick={() => setOpen((v) => !v)}
                    contentClassName={styles.triggerContent}
                    aria-haspopup="true"
                    aria-expanded={open}
                >
                    <span className={styles.triggerLabel}>
                        <IconGlobe className={styles.icon} />
                        {currentMarket && currentLanguage && (
                            <span>
                                {currentMarket.countryName} / {currentLanguage.title}
                            </span>
                        )}
                    </span>
                </Button>

                {open && (
                    <div className={styles.dropdown} role="menu">
                        <div className={styles.body}>
                            {markets.map((market) => (
                                <section
                                    key={market.newsroomUuid}
                                    className={classNames(styles.market, {
                                        [styles.currentMarket]: market.isCurrent,
                                    })}
                                >
                                    <h3 className={styles.countryName}>{market.countryName}</h3>
                                    <ul className={styles.languageList}>
                                        {market.languages.map((lang) => {
                                            const isSelected =
                                                market.isCurrent && lang.code === selected;
                                            return (
                                                <li key={lang.code}>
                                                    <a
                                                        href={applyOverride(market, lang)}
                                                        className={classNames(styles.languageLink, {
                                                            [styles.current]: isSelected,
                                                        })}
                                                        aria-current={
                                                            isSelected ? 'true' : undefined
                                                        }
                                                        onClick={() => onSelect(lang.code)}
                                                    >
                                                        {lang.title}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
}
