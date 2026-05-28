'use client';

import { Locale, translations } from '@prezly/theme-kit-nextjs';
import { useCallback, useMemo, useState } from 'react';
import type { RefinementListExposed, RefinementListProvided } from 'react-instantsearch-core';
import { connectRefinementList } from 'react-instantsearch-dom';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';

import { type ArrayElement, FacetAttribute } from '../types';

import styles from './Facet.module.scss';

const DEFAULT_FACETS_LIMIT = 7;

export const Facet = connectRefinementList(
    ({ attribute, items, refine }: RefinementListProvided & RefinementListExposed) => {
        const locale = useLocale();
        const [isExtended, setIsExtended] = useState(false);
        const visibleItems = useMemo(
            () =>
                items
                    .slice()
                    .sort((a, b) => {
                        if (attribute === 'attributes.year') {
                            return b.label.localeCompare(a.label);
                        }

                        return a.label.localeCompare(b.label);
                    })
                    .slice(0, isExtended ? undefined : DEFAULT_FACETS_LIMIT),
            [attribute, isExtended, items],
        );

        function toggleList() {
            return setIsExtended((i) => !i);
        }

        const facetTitle = useMemo(() => {
            switch (attribute) {
                case FacetAttribute.CATEGORY:
                    return (
                        <FormattedMessage
                            locale={locale}
                            for={translations.searchFacets.category}
                        />
                    );
                case FacetAttribute.YEAR:
                    return (
                        <FormattedMessage locale={locale} for={translations.searchFacets.year} />
                    );
                case FacetAttribute.MONTH:
                    return (
                        <FormattedMessage locale={locale} for={translations.searchFacets.month} />
                    );
                default:
                    return attribute;
            }
        }, [attribute, locale]);

        const getItemLabel = useCallback(
            (item: ArrayElement<typeof items>) => {
                switch (attribute) {
                    case FacetAttribute.MONTH: {
                        const { isoCode } = Locale.from(locale);
                        const date = new Date();
                        date.setMonth(Number(item.label) - 1);
                        return date.toLocaleDateString(isoCode, { month: 'long' });
                    }
                    default:
                        return item.label;
                }
            },
            [attribute, locale],
        );

        if (!items.length) {
            return null;
        }

        return (
            <section className={styles.container}>
                <h3 className={styles.title}>{facetTitle}</h3>
                <ul className={styles.list}>
                    {visibleItems.map((item) => (
                        <li key={`${attribute}_${item.label}`} className={styles.listItem}>
                            <label className={styles.listItemInner}>
                                <input
                                    type="checkbox"
                                    checked={item.isRefined}
                                    onChange={() => refine(item.value)}
                                    className={styles.input}
                                />
                                <span className={styles.checkbox} aria-hidden="true">
                                    <svg
                                        className={styles.checkmark}
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 6L5 9L10 3"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <span className={styles.label}>{getItemLabel(item)}</span>
                                <span className={styles.count}>({item.count})</span>
                            </label>
                        </li>
                    ))}
                </ul>
                {items.length > DEFAULT_FACETS_LIMIT && (
                    <Button onClick={toggleList} variation="navigation" className={styles.viewMore}>
                        {isExtended ? (
                            <FormattedMessage locale={locale} for={translations.search.viewLess} />
                        ) : (
                            <FormattedMessage locale={locale} for={translations.search.viewMore} />
                        )}
                    </Button>
                )}
            </section>
        );
    },
);

Facet.displayName = 'Facet';
