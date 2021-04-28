import type { FunctionComponent } from 'react';

type Props = {
    canLoadMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
};

const LoadMore: FunctionComponent<Props> = ({ canLoadMore, isLoading, onLoadMore }) => {
    if (!canLoadMore) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoading}
            style={{ display: 'block', marginBlock: '20px' }}
        >
            {isLoading ? 'Please wait...' : 'Load more'}
        </button>
    );
};

export default LoadMore;
