import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { Modal } from '@/components/Modal';
import type { SearchSettings } from '@/types';
import { getSearchClient } from '@/utils';

import { MainPanel, SearchBar } from './components';

import styles from './SearchWidget.module.scss';

interface Props {
    settings: SearchSettings;
    localeCode: Locale.Code;
    categories: TranslatedCategory[];
    isOpen: boolean;
    isSearchPage: boolean;
    className?: string;
    dialogClassName?: string;
    onClose: () => void;
}

export function SearchWidget({
    settings,
    localeCode,
    categories,
    isOpen,
    isSearchPage,
    className,
    dialogClassName,
    onClose,
}: Props) {
    const searchClient = useMemo(() => getSearchClient(settings), [settings]);

    const filters = `attributes.culture.code=${localeCode}`;

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
            <InstantSearch searchClient={searchClient} indexName={settings.index}>
                <Configure hitsPerPage={3} filters={filters} />
                <SearchBar />
                <MainPanel categories={categories} isSearchPage={isSearchPage} onClose={onClose} />
            </InstantSearch>
        </Modal>
    );
}
