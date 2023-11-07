'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import { useAlgoliaSettings } from '@prezly/theme-kit-nextjs';
import algoliasearch from 'algoliasearch/lite';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { type DisplayedCategory, Modal } from '@/ui';

import { MainPanel, SearchBar } from './components';

import styles from './SearchWidget.module.scss';

interface Props {
    localeCode: Locale.Code;
    categories: DisplayedCategory[];
    isOpen: boolean;
    className?: string;
    dialogClassName?: string;
    onClose: () => void;
}

export function SearchWidget({
    localeCode,
    categories,
    isOpen,
    className,
    dialogClassName,
    onClose,
}: Props) {
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = useAlgoliaSettings(); // FIXME

    const searchClient = useMemo(
        () => algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY),
        [ALGOLIA_API_KEY, ALGOLIA_APP_ID],
    );

    return (
        <Modal
            id="search-widget"
            isOpen={isOpen}
            onClose={onClose}
            className={classNames(styles.modal, className)}
            dialogClassName={dialogClassName}
            wrapperClassName={styles.wrapper}
            backdropClassName={styles.backdrop}
        >
            <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
                <Configure hitsPerPage={3} filters={`attributes.culture.code:${localeCode}`} />
                <SearchBar />
                <MainPanel categories={categories} />
            </InstantSearch>
        </Modal>
    );
}
