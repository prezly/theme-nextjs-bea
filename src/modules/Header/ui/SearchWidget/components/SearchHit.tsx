import type { Newsroom } from '@prezly/sdk';
import type { Search } from '@prezly/theme-kit-nextjs';
import type { MouseEvent } from 'react';
import type { Hit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { Link } from '@/components/Link';
import { StoryImage } from '@/components/StoryImage';
import type { ExternalStoryUrl } from '@/types';
import { getNewsroomPlaceholderColors, slugifyHeading } from '@/utils';

import styles from './SearchHit.module.scss';

interface Props {
    external: ExternalStoryUrl;
    hit: Hit<{ attributes: Search.IndexedStorySection; _tags: string[] }>;
    newsroom: Newsroom | undefined;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function SearchHit({ external, hit, newsroom, onClick }: Props) {
    const { attributes: story } = hit;

    const sectionHeading = story.section_title ?? story.section_subtitle;
    const hash = sectionHeading ? `#header-${slugifyHeading(sectionHeading)}` : undefined;

    const href = external
        ? `${external.storyUrl}${hash ?? ''}`
        : ({ routeName: 'story', params: story, hash } satisfies Link.Props['href']);

    return (
        <Link href={href} className={styles.container} onClick={onClick}>
            <div className={styles.imageWrapper}>
                <StoryImage
                    className={styles.image}
                    fallback={{
                        image: newsroom?.newsroom_logo ?? null,
                        text: newsroom?.name ?? '',
                    }}
                    placeholder={getNewsroomPlaceholderColors(newsroom)}
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
