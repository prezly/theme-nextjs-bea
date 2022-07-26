import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import Link from 'next/link';
import type { Hit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { StoryImage } from '@/components';

import styles from './Hit.module.scss';

interface Props {
    hit: Hit<{ attributes: AlgoliaStory }>;
}

function HitComponent({ hit }: Props) {
    const { attributes: story } = hit;

    return (
        <Link href={`/${story.slug}`} locale={false} passHref>
            <a className={styles.container}>
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
            </a>
        </Link>
    );
}

export default HitComponent;
