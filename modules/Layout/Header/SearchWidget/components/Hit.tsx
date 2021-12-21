import { FunctionComponent } from 'react';
import type { Hit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import StoryImage from '@/components/StoryCards/StoryImage';
import { AlgoliaStory } from 'types';

import styles from './Hit.module.scss';

interface Props {
    hit: Hit<{ attributes: AlgoliaStory }>;
}

const HitComponent: FunctionComponent<Props> = ({ hit }) => {
    const { attributes: story } = hit;

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <StoryImage
                    story={story}
                    className={styles.image}
                    placeholderClassName={styles.placeholder}
                />
            </div>
            <p className={styles.title}>
                <Highlight hit={hit} attribute="attributes.title" tagName="mark" />
            </p>
        </div>
    );
};

export default HitComponent;
