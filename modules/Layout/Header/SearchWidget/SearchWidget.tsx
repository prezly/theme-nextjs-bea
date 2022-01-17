import algoliasearch from 'algoliasearch/lite';
import classNames from 'classnames';
import { FunctionComponent, useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { Modal } from '@/components';
import { useAlgoliaSettings, useCurrentLocale } from '@/hooks';

import { MainPanel, SearchBar } from './components';

import styles from './SearchWidget.module.scss';

interface Props {
    isOpen: boolean;
    className?: string;
    dialogClassName?: string;
    onClose: () => void;
}

// eslint-disable-next-line arrow-body-style
const SearchWidget: FunctionComponent<Props> = ({
    isOpen,
    className,
    dialogClassName,
    onClose,
}) => {
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
                    restrictSearchableAttributes={['attributes.title']}
                    filters={`attributes.culture.code:${currentLocale.toUnderscoreCode()}`}
                />
                <SearchBar />
                <MainPanel />
            </InstantSearch>
        </Modal>
    );
};

export default SearchWidget;
