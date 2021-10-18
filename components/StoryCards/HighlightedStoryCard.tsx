import { format } from 'date-fns';
import Link from 'next/link';
import { FunctionComponent } from 'react';

import { StoryWithImage } from '@/modules/Stories';

import StoryCardCategoryList from './StoryCardCategoryList';
import StoryImage from './StoryImage';

import styles from './HighlightedStoryCard.module.scss';

type Props = {
    story: StoryWithImage;
};

const HighlightedStoryCard: FunctionComponent<Props> = ({ story }) => {
    const { categories, published_at, title, subtitle } = story;

    const publishedDate = format(new Date(published_at as string), 'MMMM d, y');

    return (
        <div className={styles.container}>
            <Link href={`/${story.slug}`} passHref>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className={styles.imageWrapper}>
                    <StoryImage story={story} />
                </a>
            </Link>
            <div className={styles.content}>
                <div className={styles.dateAndCategory}>
                    <span className={styles.date}>{publishedDate}</span>
                    {!!categories.length && <span className={styles.separator}>&middot;</span>}
                    <StoryCardCategoryList categories={categories} />
                </div>

                <h2 className={styles.title}>
                    <Link href={`/${story.slug}`} passHref>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a className={styles.titleLink}>{title}</a>
                    </Link>
                </h2>

                {subtitle && (
                    <p className={styles.subtitle}>
                        <Link href={`/${story.slug}`} passHref>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className={styles.titleLink}>{subtitle}</a>
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default HighlightedStoryCard;
