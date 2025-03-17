import type { Search } from '@prezly/theme-kit-nextjs';
import type { MouseEvent } from 'react';
import type { Hit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { Link } from '@/components/Link';
import { StoryImage } from '@/components/StoryImage';

import styles from './SearchHit.module.scss';

interface Props {
    hit: Hit<{ attributes: Search.IndexedStory }>;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function SearchHit({ hit, onClick }: Props) {
    const { attributes: story } = hit;

    return (
        <Link
            href={{ routeName: 'story', params: story }}
            className={styles.container}
            onClick={onClick}
        >
            <div className={styles.imageWrapper}>
                <StoryImage
                    className={styles.image}
                    placeholderClassName={styles.placeholder}
                    size="tiny"
                    thumbnailImage={story.thumbnail_image}
                    title={story.title}
                />
            </div>
            <p className={styles.title}>
                <Highlight hit={hit} attribute="attributes.title" tagName="mark" />
            </p>
        </Link>
    );
}
