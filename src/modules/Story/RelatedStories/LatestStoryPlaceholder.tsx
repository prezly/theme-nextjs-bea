import type { Newsroom } from '@prezly/sdk';

import { PREVIEW } from '@/events';
import { IconExternalLink, IconGlobe, IconImage } from '@/icons';
import { analytics } from '@/utils';

import styles from './LatestStoryPlaceholder.module.scss';

interface Props {
    newsroom: Newsroom;
}

export function LatestStoryPlaceholder({ newsroom }: Props) {
    const storiesUrl = 'https://rock.prezly.com/stories';

    return (
        <a
            href={storiesUrl}
            className={styles.wrapper}
            onClick={() => analytics.track(PREVIEW.CREATE_ANOTHER_STORY_CLICKED)}
            rel="noopener noreferrer"
            target="_blank"
        >
            <div className={styles.imageWrapper}>
                <IconImage className={styles.icon} />
            </div>
            <div className={styles.content}>
                <p className={styles.title}>This could be your next story</p>
                <p className={styles.description}>
                    The most recent stories will appear here in order to keep your visitors reading
                </p>
                <p className={styles.url}>
                    <IconGlobe />
                    <span>{newsroom.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                </p>
            </div>
            <p className={styles.createStoryText}>
                Create another story <IconExternalLink className={styles.icon} />
            </p>
        </a>
    );
}
