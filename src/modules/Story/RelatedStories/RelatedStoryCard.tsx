import { Link } from '@/components/Link';
import { StoryImage } from '@/components/StoryImage';
import { IconGlobe } from '@/icons';
import type { ListStory } from '@/types';
import { getNewsroomPlaceholderColors, type PublicNewsroom } from '@/utils';

import styles from './RelatedStoryCard.module.scss';

interface Props {
    newsroom: PublicNewsroom;
    story: ListStory;
    /** Absolute story URL, with the theme's reverse-proxy prefix already applied. */
    url: string;
}

export function RelatedStoryCard({ newsroom, story, url }: Props) {
    const { description } = story.oembed;

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <StoryImage
                    className={styles.image}
                    fallback={{ image: newsroom.newsroom_logo, text: newsroom.name }}
                    placeholder={getNewsroomPlaceholderColors(newsroom)}
                    placeholderClassName={styles.placeholder}
                    size="small"
                    thumbnailImage={story.thumbnail_image}
                    title={story.title}
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>
                    {/* Stretched over the whole card, so it is the card's only link. */}
                    <Link className={styles.link} href={url}>
                        {story.title}
                    </Link>
                </h3>
                {description && <p className={styles.description}>{description}</p>}
                <p className={styles.domain}>
                    <IconGlobe aria-hidden className={styles.icon} />
                    <span className={styles.domainName}>{getHost(url)}</span>
                </p>
            </div>
        </div>
    );
}

function getHost(url: string) {
    try {
        return new URL(url).host;
    } catch {
        return url;
    }
}
