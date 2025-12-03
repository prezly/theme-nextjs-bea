import { FormattedDate } from '@prezly/theme-kit-nextjs/index';
import classNames from 'classnames';

import { PREVIEW } from '@/events';
import { IconExternalLink, IconImage } from '@/icons';
import { analytics } from '@/utils';

import styles from './PlaceholderStoryCard.module.scss';

interface Props {
    title: string;
    description: string;
    isCategoryPage?: boolean;
    isHighlight?: boolean;
    hasStories?: boolean;
}

export function PlaceholderStoryCard({
    title,
    description,
    isCategoryPage = false,
    isHighlight = false,
    hasStories = false,
}: Props) {
    const date = new Date(2023, 2, 3);
    const storiesUrl = 'https://rock.prezly.com/stories';

    return (
        <a
            className={classNames(styles.wrapper, {
                [styles.highlight]: isHighlight,
                [styles.categoryPage]: isCategoryPage,
            })}
            href={storiesUrl}
            onClick={() => analytics.track(PREVIEW.CREATE_STORY_CLICKED)}
            rel="noopener noreferrer"
            target="_blank"
        >
            <div className={styles.imageWrapper}>
                <IconImage />
            </div>
            <div className={styles.content}>
                <time className={styles.date} dateTime={date.toDateString()}>
                    <FormattedDate value={date} />
                </time>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
            </div>
            <p className={styles.createStoryText}>
                {hasStories ? 'Create another story' : 'Create your first story'}
                <IconExternalLink className={styles.icon} />
            </p>
        </a>
    );
}
