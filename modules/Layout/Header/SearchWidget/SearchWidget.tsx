import algoliasearch from 'algoliasearch/lite';
import { FunctionComponent } from 'react';
import { Hits, InstantSearch, SearchBox, Stats } from 'react-instantsearch-dom';

import Modal from '@/components/Modal';

interface Props {
    isOpen: boolean;
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
const SearchWidget: FunctionComponent<Props> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
                <SearchBox />
                <Stats />
                <Hits />
            </InstantSearch>
        </Modal>
    );
};

export default SearchWidget;
