import { StoryPublicationDate } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import Link from 'next/link';

import { useThemeSettings } from '@/hooks';
import type { StoryWithImage } from 'types';

import CategoriesList from '../CategoriesList';
import StoryImage from '../StoryImage';

import styles from './HighlightedStoryCard.module.scss';

type Props = {
    story: StoryWithImage;
};

const HUGE_TITLE_CHARACTERS_COUNT = 140;
const ENORMOUS_TITLE_CHARACTERS_COUNT = 240;

function HighlightedStoryCard({ story }: Props) {
    const { categories, title, subtitle } = story;
    const { showDate } = useThemeSettings();

    const isHugeTitle = title.length > HUGE_TITLE_CHARACTERS_COUNT;
    const isEnormousTitle = title.length > ENORMOUS_TITLE_CHARACTERS_COUNT;

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
                <div className={styles.categoriesWrapper}>
                    {/* 
                        Since the position of date is changed the separator is no longer needed.
                        Commenting out instead of deleting in case we need to revert back.
                    */}
                    {/*
                    {categories.length > 0 && showDate && (
                        <span className={styles.separator}>&middot;</span>
                    )} 
                    */}
                    <CategoriesList categories={categories} />
                </div>

                <h2
                    className={classNames(styles.title, {
                        [styles.huge]: isHugeTitle,
                    })}
                >
                    <Link href={`/${story.slug}`} locale={false} passHref>
                        <a className={styles.titleLink}>{title}</a>
                    </Link>
                </h2>

                {subtitle && (
                    <p
                        className={classNames(styles.subtitle, {
                            [styles.limited]: isHugeTitle,
                            [styles.hidden]: isEnormousTitle,
                        })}
                    >
                        <Link href={`/${story.slug}`} locale={false} passHref>
                            <a className={styles.subtitleLink}>{subtitle}</a>
                        </Link>
                    </p>
                )}

                {showDate && (
                    <span className={styles.date}>
                        <StoryPublicationDate story={story} />
                    </span>
                )}
            </div>
        </div>
    );
}

export default HighlightedStoryCard;
