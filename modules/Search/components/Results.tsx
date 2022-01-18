import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import { FunctionComponent } from 'react';
import type { Hit as HitType, InfiniteHitsProvided } from 'react-instantsearch-core';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { useIntl } from 'react-intl';

import Button from '@/components/Button';
import { AlgoliaStory } from 'types';

import Hit from './Hit';

import containerStyles from '@/modules/InfiniteStories/InfiniteStories.module.scss';
import listStyles from '@/modules/InfiniteStories/StoriesList.module.scss';

interface Props {
    isSearching: boolean;
}

type SearchHit = HitType<{ attributes: AlgoliaStory }>;

const Results: FunctionComponent<Props & InfiniteHitsProvided<SearchHit>> = ({
    isSearching,
    hits,
    hasMore,
    refineNext,
}) => {
    const { formatMessage } = useIntl();

    return (
        <div
            className={classNames(
                containerStyles.container,
                containerStyles.searchResultsContainer,
            )}
        >
            <div
                className={classNames(
                    listStyles.storiesContainer,
                    listStyles.searchResultsContainer,
                )}
            >
                {hits.map((hit) => (
                    <Hit key={hit.objectID} hit={hit} />
                ))}
            </div>

            {hasMore && (
                <Button
                    variation="secondary"
                    onClick={refineNext}
                    isLoading={isSearching}
                    className={containerStyles.loadMore}
                >
                    {formatMessage(
                        isSearching
                            ? translations.misc.stateLoading
                            : translations.actions.loadMore,
                    )}
                </Button>
            )}
        </div>
    );
};

export default connectInfiniteHits(Results);
