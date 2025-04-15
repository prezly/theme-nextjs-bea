'use client';

import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import type { InfiniteHitsProvided } from 'react-instantsearch-core';
import { connectInfiniteHits } from 'react-instantsearch-dom';

import { useIntl } from '@/adapters/client';
import { Button } from '@/components/Button';
import type { ThemeSettings } from '@/theme-settings';

import type { Props as HitProps } from './Hit';
import { Hit } from './Hit';
import { useSearchState } from './SearchStateContext';

import styles from './Results.module.scss';
import containerStyles from '@/modules/InfiniteStories/InfiniteStories.module.scss'; // FIXME: Pass this from outside
import listStyles from '@/modules/InfiniteStories/StoriesList.module.scss'; // FIXME: Find a way to pass this from ouside

type Props = {
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
};

export const Results = connectInfiniteHits(
    ({
        hits,
        hasMore,
        refineNext,
        showDate,
        showSubtitle,
        storyCardVariant,
    }: InfiniteHitsProvided<HitProps['hit']> & Props) => {
        const { formatMessage } = useIntl();
        const { searching: isSearching } = useSearchState();

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
                        <Hit
                            key={hit.objectID}
                            hit={hit}
                            showDate={showDate}
                            showSubtitle={showSubtitle}
                            storyCardVariant={storyCardVariant}
                        />
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
