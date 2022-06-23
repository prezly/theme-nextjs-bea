import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import type { Hit as HitType, InfiniteHitsProvided } from 'react-instantsearch-core';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { useIntl } from 'react-intl';

import { useAlgoliaState } from './AlgoliaStateContext';
import Hit from './Hit';

import styles from './Results.module.scss';
import containerStyles from '@/modules/InfiniteStories/InfiniteStories.module.scss';
import listStyles from '@/modules/InfiniteStories/StoriesList.module.scss';

type SearchHit = HitType<{ attributes: AlgoliaStory }>;

function Results({ hits, hasMore, refineNext }: InfiniteHitsProvided<SearchHit>) {
    const { formatMessage } = useIntl();
    const { searching: isSearching } = useAlgoliaState();

    return (
        <div className={classNames(containerStyles.container, styles.container)}>
            <div className={classNames(listStyles.storiesContainer, styles.list)}>
                {!hits.length && (
                    <p className={styles.fallbackText}>
                        {formatMessage(
                            isSearching
                                ? translations.misc.stateLoading
                                : translations.search.noResults,
                        )}
                    </p>
                )}
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
}

export default connectInfiniteHits(Results);
