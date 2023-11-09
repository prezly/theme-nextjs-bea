'use client';

import { translations } from '@prezly/theme-kit-intl';
import classNames from 'classnames';
import type { InfiniteHitsProvided } from 'react-instantsearch-core';
import { connectInfiniteHits } from 'react-instantsearch-dom';

import { useIntl } from '@/theme-kit/intl/client';
import { Button } from '@/ui';

import { useAlgoliaState } from './AlgoliaStateContext';
import type { Props as HitProps } from './Hit';
import { Hit } from './Hit';

import styles from './Results.module.scss';
import containerStyles from '@/modules/InfiniteStories/InfiniteStories.module.scss';
import listStyles from '@/modules/InfiniteStories/StoriesList.module.scss';

export const Results = connectInfiniteHits(
    ({ hits, hasMore, refineNext }: InfiniteHitsProvided<HitProps['hit']>) => {
        const { formatMessage } = useIntl();
        const { searching: isSearching } = useAlgoliaState();

        return (
            <div className={containerStyles.container}>
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
                        loading={isSearching}
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
    },
);

Results.displayName = 'Results';
