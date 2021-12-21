import algoliasearch from 'algoliasearch/lite';
import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import Modal from '@/components/Modal';
import { useCurrentLocale } from '@/hooks';

import MainPanel from './components/MainPanel';
import SearchBar from './components/SearchBar';

import styles from './SearchWidget.module.scss';

interface Props {
    isOpen: boolean;
    className?: string;
    dialogClassName?: string;
    onClose: () => void;
}

// eslint-disable-next-line prefer-destructuring
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
// eslint-disable-next-line prefer-destructuring
const ALGOLIA_PUBLIC_API_KEY = process.env.ALGOLIA_PUBLIC_API_KEY;
// eslint-disable-next-line prefer-destructuring
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_PUBLIC_API_KEY);

// eslint-disable-next-line arrow-body-style
const SearchWidget: FunctionComponent<Props> = ({
    isOpen,
    className,
    dialogClassName,
    onClose,
}) => {
    const currentLocale = useCurrentLocale();

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
