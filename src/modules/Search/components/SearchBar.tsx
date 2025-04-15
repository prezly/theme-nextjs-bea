'use client';

import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useState } from 'react';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import { useDevice } from '@/hooks';
import { IconMenu } from '@/icons';

import { AVAILABLE_FACET_ATTRIBUTES } from '../utils';

import { Facet } from './Facet';
import { SearchInput } from './SearchInput';

import styles from './SearchBar.module.scss';

export function SearchBar() {
    const locale = useLocale();
    const [isShown, setIsShown] = useState(false);
    const { isMobile } = useDevice();

    function toggleFacets() {
        return setIsShown((s) => !s);
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <SearchInput />
                </div>
                {isMobile && (
                    <Button
                        variation="navigation"
                        icon={IconMenu}
                        onClick={toggleFacets}
                        className={styles.toggleFacets}
                    >
                        <FormattedMessage locale={locale} for={translations.search.filters} />
                    </Button>
                )}
                <div className={classNames(styles.facets, { [styles.facetsOpen]: isShown })}>
                    <p className={styles.filters}>
                        <FormattedMessage locale={locale} for={translations.search.filters} />
                    </p>
                    {AVAILABLE_FACET_ATTRIBUTES.map((attribute) => (
                        <Facet key={attribute} attribute={attribute} showMore showMoreLimit={50} />
                    ))}
                </div>
            </div>
        </div>
    );
}
