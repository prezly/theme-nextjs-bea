import type { AlgoliaStory } from '@prezly/theme-kit-core';
import Link from 'next/link';
import type { Hit as SearchHit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { StoryImage } from '@/components/StoryImage';

import styles from './Hit.module.scss';

interface Props {
    hit: SearchHit<{ attributes: AlgoliaStory }>;
}

export function Hit({ hit }: Props) {
    const { attributes: story } = hit;

    return (
        <Link href={`/${story.slug}`} locale={false} className={styles.container} legacyBehavior>
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
