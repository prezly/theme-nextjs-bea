'use client';

import { Locale, translations } from '@prezly/theme-kit-nextjs';
import { type CSSProperties, useCallback, useMemo, useState } from 'react';
import type { RefinementListExposed, RefinementListProvided } from 'react-instantsearch-core';
import { connectRefinementList } from 'react-instantsearch-dom';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';

import { type ArrayElement, FacetAttribute, type FacetCategory } from '../types';

import styles from './Facet.module.scss';

const DEFAULT_FACETS_LIMIT = 7;

export const Facet = connectRefinementList(
    ({
        attribute,
        categoryTree = [],
        items: allItems,
        refine,
    }: RefinementListProvided & RefinementListExposed & { categoryTree?: FacetCategory[] }) => {
        const locale = useLocale();
        const [isExtended, setIsExtended] = useState(false);

        // Categories filtered by ID are listed as the tree of the site. An ID that is not a
        // category of the site in this language has no name to show, and is left out.
        const categories = useMemo(
            () =>
                new Map(
                    categoryTree.map((category, index) => [
                        String(category.id),
                        { ...category, index },
                    ]),
                ),
            [categoryTree],
        );
        const items = useMemo(
            () =>
                attribute === FacetAttribute.CATEGORY_ID
                    ? allItems.filter((item) => categories.has(item.label))
                    : allItems,
            [allItems, attribute, categories],
        );

        const visibleItems = useMemo(
            () =>
                items
                    .slice()
                    .sort((a, b) => {
                        if (attribute === 'attributes.year') {
                            return b.label.localeCompare(a.label);
                        }
                        if (attribute === FacetAttribute.CATEGORY_ID) {
                            return (
                                (categories.get(a.label)?.index ?? 0) -
                                (categories.get(b.label)?.index ?? 0)
                            );
                        }

                        return a.label.localeCompare(b.label);
                    })
                    .slice(0, isExtended ? undefined : DEFAULT_FACETS_LIMIT),
            [attribute, categories, isExtended, items],
        );

        function toggleList() {
            return setIsExtended((i) => !i);
        }

        const facetTitle = useMemo(() => {
            switch (attribute) {
                case FacetAttribute.CATEGORY:
                case FacetAttribute.CATEGORY_ID:
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
                    case FacetAttribute.CATEGORY_ID:
                        return categories.get(item.label)?.name ?? item.label;
                    default:
                        return item.label;
                }
            },
            [attribute, categories, locale],
        );

        if (!items.length) {
            return null;
        }

        return (
            <Dropdown
                label={<span className={styles.title}>{facetTitle}</span>}
                className={styles.container}
                menuClassName={styles.menu}
                variation="secondary"
            >
                {visibleItems.map((item) => (
                    <li
                        key={`${attribute}_${item.label}`}
                        // A subcategory is indented under its parent.
                        style={
                            attribute === FacetAttribute.CATEGORY_ID
                                ? ({
                                      '--depth': categories.get(item.label)?.depth ?? 0,
                                  } as CSSProperties)
                                : undefined
                        }
                    >
                        <label className={styles.listItemInner}>
                            <input
                                type="checkbox"
                                checked={item.isRefined}
                                onChange={() => refine(item.value)}
                                className={styles.input}
                            />
                            <span className={styles.label}>{getItemLabel(item)}</span>
                            <span className={styles.count}>({item.count})</span>
                        </label>
                    </li>
                ))}
                {items.length > DEFAULT_FACETS_LIMIT && (
                    <Button onClick={toggleList} variation="navigation" className={styles.viewMore}>
                        {isExtended ? (
                            <FormattedMessage locale={locale} for={translations.search.viewLess} />
                        ) : (
                            <FormattedMessage locale={locale} for={translations.search.viewMore} />
                        )}
                    </Button>
                )}
            </Dropdown>
        );
    },
);

Facet.displayName = 'Facet';
