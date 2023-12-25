import { useAlgoliaSettings, useCurrentLocale } from '@prezly/theme-kit-nextjs';
import algoliasearch from 'algoliasearch/lite';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { Modal } from '@/ui';

import { MainPanel, SearchBar } from './components';

import styles from './SearchWidget.module.scss';

interface Props {
    isOpen: boolean;
    className?: string;
    dialogClassName?: string;
    onClose: () => void;
}

function SearchWidget({ isOpen, className, dialogClassName, onClose }: Props) {
    const currentLocale = useCurrentLocale();
    const {
        ALGOLIA_APP_ID: algoliaAppId,
        ALGOLIA_API_KEY: algoliaApiKey,
        ALGOLIA_INDEX: algoliaIndex,
    } = useAlgoliaSettings();

    const searchClient = useMemo(
        () => algoliasearch(algoliaAppId, algoliaApiKey),
        [algoliaApiKey, algoliaAppId],
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
            <InstantSearch searchClient={searchClient} indexName={algoliaIndex}>
                <Configure
                    hitsPerPage={3}
                    filters={`attributes.culture.code:${currentLocale.toUnderscoreCode()}`}
                />
                <SearchBar />
                <MainPanel />
            </InstantSearch>
        </Modal>
    );
}

export default SearchWidget;
