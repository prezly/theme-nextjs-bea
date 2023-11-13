'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import algoliasearch from 'algoliasearch/lite';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import type { AlgoliaSettings } from '@/theme-kit';
import type { TranslatedCategory } from '@/theme-kit/domain';
import { Modal } from '@/ui';

import { MainPanel, SearchBar } from './components';

import styles from './SearchWidget.module.scss';

interface Props {
    algoliaSettings: AlgoliaSettings;
    localeCode: Locale.Code;
    categories: TranslatedCategory[];
    isOpen: boolean;
    className?: string;
    dialogClassName?: string;
    onClose: () => void;
}

export function SearchWidget({
    algoliaSettings,
    localeCode,
    categories,
    isOpen,
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
                <MainPanel categories={categories} />
            </InstantSearch>
        </Modal>
    );
}
