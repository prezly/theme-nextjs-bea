import { FunctionComponent } from 'react';
import { SearchBox } from 'react-instantsearch-dom';

import styles from './Sidebar.module.scss';

interface Props {}

const Sidebar: FunctionComponent<Props> = () => {
    return (
        <div className={styles.container}>
            <SearchBox />
        </div>
    );
};

export default Sidebar;
