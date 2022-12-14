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

const HUGE_TITLE_CHARACTERS_COUNT = 110;
const ENORMOUS_TITLE_CHARACTERS_COUNT = 220;

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
                        size="big"
                        className={styles.image}
                        placeholderClassName={styles.placeholder}
                    />
                </a>
            </Link>
            <div className={styles.content}>
                <CategoriesList categories={categories} />

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

                {showDate && !story.is_pinned && (
                    <span className={styles.date}>
                        <StoryPublicationDate story={story} />
                    </span>
                )}
            </div>
        </div>
    );
}

export default HighlightedStoryCard;
