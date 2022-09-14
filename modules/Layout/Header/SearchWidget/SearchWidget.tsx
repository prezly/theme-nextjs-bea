import { useAlgoliaSettings, useCurrentLocale } from '@prezly/theme-kit-nextjs';
import { Modal } from '@prezly/themes-ui-components';
import algoliasearch from 'algoliasearch/lite';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

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
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = useAlgoliaSettings();

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
