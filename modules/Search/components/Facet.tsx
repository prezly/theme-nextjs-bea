'use client';

import { translations } from '@prezly/theme-kit-nextjs';
import { useCallback, useMemo, useState } from 'react';
import type { RefinementListExposed, RefinementListProvided } from 'react-instantsearch-core';
import { connectRefinementList } from 'react-instantsearch-dom';

import { FormattedDate, FormattedMessage, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';

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
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .slice(0, isExtended ? undefined : DEFAULT_FACETS_LIMIT),
            [isExtended, items],
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
                        const date = new Date();
                        date.setMonth(Number(item.label) - 1);
                        return <FormattedDate value={date} />;
                    }
                    default:
                        return item.label;
                }
            },
            [attribute],
        );

        if (!items.length) {
            return null;
        }

        return (
            <Dropdown
                label={<span className={styles.title}>{facetTitle}</span>}
                className={styles.container}
                buttonClassName={styles.button}
                buttonContentClassName={styles.buttonContent}
                menuClassName={styles.menu}
            >
                {visibleItems.map((item) => (
                    <li key={`${attribute}_${item.label}`}>
                        <label className={styles.listItemInner}>
                            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
