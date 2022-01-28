import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';

import { StoryWithImage } from 'types';

import CategoriesList from '../CategoriesList';
import StoryImage from '../StoryImage';
import StoryPublicationDate from '../StoryPublicationDate';

import styles from './HighlightedStoryCard.module.scss';

type Props = {
    story: StoryWithImage;
};

const HUGE_TITLE_WORDS_COUNT = 15;

const HighlightedStoryCard: FunctionComponent<Props> = ({ story }) => {
    const { categories, title, subtitle } = story;

    const publishedDate = <StoryPublicationDate story={story} />;

    const isHugeTitle = title.split(' ').length > HUGE_TITLE_WORDS_COUNT;

    return (
        <div className={styles.container}>
            <Link href={`/${story.slug}`} locale={false} passHref>
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
                    <Link href={`/${story.slug}`} locale={false} passHref>
                        <a className={styles.titleLink}>{title}</a>
                    </Link>
                </h2>

                {subtitle && (
                    <p
                        className={classNames(styles.subtitle, {
                            [styles.subtitleLimited]: isHugeTitle,
                        })}
                    >
                        <Link href={`/${story.slug}`} locale={false} passHref>
                            <a className={styles.titleLink}>{subtitle}</a>
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default HighlightedStoryCard;
