import type { AlgoliaStory } from '@prezly/theme-kit-core';
import type { Hit as SearchHit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { Link } from '@/components/Link';
import { StoryImage } from '@/components/StoryImage';

import styles from './Hit.module.scss';

interface Props {
    hit: SearchHit<{ attributes: AlgoliaStory }>;
}

export function Hit({ hit }: Props) {
    const { attributes: story } = hit;

    return (
        <Link href={{ routeName: 'story', params: story }} className={styles.container}>
            <div className={styles.imageWrapper}>
                <StoryImage
                    story={story}
                    size="tiny"
                    className={styles.image}
                    placeholderClassName={styles.placeholder}
                />
            </div>
            <p className={styles.title}>
                <Highlight hit={hit} attribute="attributes.title" tagName="mark" />
            </p>
        </Link>
    );
}
