import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';

import CategoriesList from '@/components/CategoriesList';
import { getStoryPublicationDate } from '@/utils/prezly';
import { StoryWithImage } from 'types';

import StoryImage from './StoryImage';

import styles from './HighlightedStoryCard.module.scss';

type Props = {
    story: StoryWithImage;
};

const HUGE_TITLE_WORDS_COUNT = 15;

const HighlightedStoryCard: FunctionComponent<Props> = ({ story }) => {
    const { categories, title, subtitle } = story;

    const publishedDate = getStoryPublicationDate(story);

    const isHugeTitle = title.split(' ').length > HUGE_TITLE_WORDS_COUNT;

    return (
        <div className={styles.container}>
            <Link href={`/${story.slug}`} passHref>
                <a className={styles.imageWrapper}>
                    <StoryImage
                        story={story}
                        className={styles.image}
                        placeholderClassName={styles.placeholder}
                    />
                </a>
            </Link>
            <div className={styles.content}>
                <div className={styles.dateAndCategory}>
                    {publishedDate && <span className={styles.date}>{publishedDate}</span>}
                    {categories.length > 0 && publishedDate && (
                        <span className={styles.separator}>&middot;</span>
                    )}
                    <CategoriesList categories={categories} />
                </div>

                <h2 className={styles.title}>
                    <Link href={`/${story.slug}`} passHref>
                        <a className={styles.titleLink}>{title}</a>
                    </Link>
                </h2>

                {subtitle && (
                    <p
                        className={classNames(styles.subtitle, {
                            [styles.subtitleLimited]: isHugeTitle,
                        })}
                    >
                        <Link href={`/${story.slug}`} passHref>
                            <a className={styles.titleLink}>{subtitle}</a>
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default HighlightedStoryCard;
