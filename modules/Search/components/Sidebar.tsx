import { FunctionComponent } from 'react';
import { SearchBox } from 'react-instantsearch-dom';

import Facet from './Facet';

import styles from './Sidebar.module.scss';

interface Props {}

const Sidebar: FunctionComponent<Props> = () => (
    <div className={styles.container}>
        <SearchBox />
        <Facet attribute="attributes.categories.id" />
        <Facet attribute="attributes.published_at" />
    </div>
);

export default Sidebar;
