import type { FunctionComponent } from 'react';

type Props = {
    isLoading: boolean;
    onLoadMore: () => void;
};

const LoadMore: FunctionComponent<Props> = ({ isLoading, onLoadMore }) => (
    <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        style={{ display: 'block', marginBlock: '20px' }}
    >
        {isLoading ? 'Please wait...' : 'Load more'}
    </button>
);

export default LoadMore;
