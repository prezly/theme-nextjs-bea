import type { FunctionComponent } from 'react';

import Button from '@/components/Button';

import styles from './LoadMore.module.scss';

type Props = {
    isLoading: boolean;
    onLoadMore: () => void;
};

const LoadMore: FunctionComponent<Props> = ({ isLoading, onLoadMore }) => (
    <Button
        variation="secondary"
        onClick={onLoadMore}
        isLoading={isLoading}
        className={styles.button}
    >
        Load more
    </Button>
);

export default LoadMore;
