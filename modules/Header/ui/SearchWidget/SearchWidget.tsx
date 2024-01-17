import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import algoliasearch from 'algoliasearch/lite';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { Modal } from '@/components/Modal';
import type { AlgoliaSettings } from 'types';

import { MainPanel, SearchBar } from './components';

import styles from './SearchWidget.module.scss';

interface Props {
    algoliaSettings: AlgoliaSettings;
    localeCode: Locale.Code;
    categories: TranslatedCategory[];
    isOpen: boolean;
    isSearchPage: boolean;
    className?: string;
    dialogClassName?: string;
    onClose: () => void;
}

export function SearchWidget({
    algoliaSettings,
    localeCode,
    categories,
    isOpen,
    isSearchPage,
    className,
    dialogClassName,
    onClose,
}: Props) {
    const { appId, apiKey, index } = algoliaSettings;

    const searchClient = useMemo(() => algoliasearch(appId, apiKey), [appId, apiKey]);

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
            <InstantSearch searchClient={searchClient} indexName={index}>
                <Configure hitsPerPage={3} filters={`attributes.culture.code:${localeCode}`} />
                <SearchBar />
                <MainPanel categories={categories} isSearchPage={isSearchPage} onClose={onClose} />
            </InstantSearch>
        </Modal>
    );
}
