import type { Newsroom, TranslatedCategory } from '@prezly/sdk';
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
    newsrooms: Newsroom[];
    newsroomUuid: string;
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
    newsrooms,
    newsroomUuid,
}: Props) {
    const searchClient = useMemo(() => getSearchClient(settings), [settings]);

    const filters = `attributes.culture.code=${localeCode}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={classNames(styles.modal, className)}
            dialogClassName={dialogClassName}
            wrapperClassName={styles.wrapper}
            backdropClassName={styles.backdrop}
        >
            <InstantSearch searchClient={searchClient} indexName={settings.index}>
                <Configure hitsPerPage={15} filters={filters} />
                <SearchBar />
                <MainPanel
                    categories={categories}
                    isSearchPage={isSearchPage}
                    newsrooms={newsrooms}
                    newsroomUuid={newsroomUuid}
                    onClose={onClose}
                />
            </InstantSearch>
        </Modal>
    );
}
