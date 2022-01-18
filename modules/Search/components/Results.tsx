import classNames from 'classnames';
import { FunctionComponent } from 'react';
import type { Hit as HitType, InfiniteHitsProvided } from 'react-instantsearch-core';
import { connectInfiniteHits } from 'react-instantsearch-dom';

import { AlgoliaStory } from 'types';

import Hit from './Hit';

import containerStyles from '@/modules/InfiniteStories/InfiniteStories.module.scss';
import listStyles from '@/modules/InfiniteStories/StoriesList.module.scss';

const Results: FunctionComponent<InfiniteHitsProvided<HitType<{ attributes: AlgoliaStory }>>> = ({
    hits,
}) => (
    <div className={classNames(containerStyles.container, containerStyles.searchResultsContainer)}>
        <div className={classNames(listStyles.storiesContainer, listStyles.searchResultsContainer)}>
            {hits.map((hit) => (
                <Hit key={hit.objectID} hit={hit} />
            ))}
        </div>
    </div>
);

export default connectInfiniteHits(Results);
