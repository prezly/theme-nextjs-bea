'use client';

import type { Newsroom } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import type { InfiniteHitsProvided } from 'react-instantsearch-core';
import { connectInfiniteHits } from 'react-instantsearch-dom';

import { useIntl } from '@/adapters/client';
import { Button } from '@/components/Button';
import type { ThemeSettings } from '@/theme-settings';
import type { ExternalStoryUrl } from '@/types';
import { getNewsroomUuidFromHitTags } from '@/utils';

import type { Props as HitProps } from './Hit';
import { Hit } from './Hit';
import { useSearchState } from './SearchStateContext';

import styles from './Results.module.scss';
import containerStyles from '@/modules/InfiniteStories/InfiniteStories.module.scss'; // FIXME: Pass this from outside
import listStyles from '@/modules/InfiniteStories/StoriesList.module.scss'; // FIXME: Find a way to pass this from ouside

type Props = {
    newsrooms: Newsroom[];
    newsroomUuid: string;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
};

export const Results = connectInfiniteHits(
    ({
        hasMore,
        hits,
        newsrooms,
        newsroomUuid,
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
                    {hits.map((hit) => {
                        const storyNewsroomUuid = getNewsroomUuidFromHitTags(hit._tags);
                        const newsroom = newsrooms.find(
                            (newsroom) => newsroom.uuid === storyNewsroomUuid,
                        );

                        // This should not happen but in case we can't find the newsroom
                        // via UUID, we can't reliably render the story card.
                        if (!newsroom) {
                            return null;
                        }

                        const isExternal =
                            newsroom.uuid !== newsroomUuid
                                ? ({
                                      newsroomUrl: newsroom.url,
                                      // TODO: Add the URL here when it's available in Meilisearch
                                      storyUrl: '',
                                  } satisfies ExternalStoryUrl)
                                : false;

                        return (
                            <Hit
                                key={hit.objectID}
                                hit={hit}
                                isExternal={isExternal}
                                newsroom={newsroom}
                                showDate={showDate}
                                showSubtitle={showSubtitle}
                                storyCardVariant={storyCardVariant}
                            />
                        );
                    })}
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
