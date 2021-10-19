import type { FunctionComponent } from 'react';

import styles from './LoadMore.module.scss';

type Props = {
    isLoading: boolean;
    onLoadMore: () => void;
};

const LoadMore: FunctionComponent<Props> = ({ isLoading, onLoadMore }) => (
    <button type="button" onClick={onLoadMore} disabled={isLoading} className={styles.button}>
        {isLoading ? 'Please wait...' : 'Load more'}
    </button>
);

export default LoadMore;
