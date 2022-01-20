import { FunctionComponent } from 'react';

import { CATEGORY_ATTRIBUTE } from '../utils';

import Facet from './Facet';
import SearchInput from './SearchInput';

import styles from './Sidebar.module.scss';

interface Props {}

const Sidebar: FunctionComponent<Props> = () => (
    <div className={styles.container}>
        <Facet attribute={CATEGORY_ATTRIBUTE} />
        <Facet attribute="attributes.published_at" />
        <SearchInput />
    </div>
);

export default Sidebar;
