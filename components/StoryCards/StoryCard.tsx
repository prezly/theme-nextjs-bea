import { StoryPublicationDate } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import Link from 'next/link';

import { useThemeSettings } from '@/hooks';
import type { StoryWithImage } from 'types';

import CategoriesList from '../CategoriesList';
import StoryImage from '../StoryImage';

import styles from './StoryCard.module.scss';

type Props = {
    story: StoryWithImage;
    size?: 'small' | 'medium' | 'big';
};

function StoryCard({ story, size = 'small' }: Props) {
    const { categories, title, subtitle } = story;
    const { showDate, showSubtitle } = useThemeSettings();

    const HeadingTag = size === 'small' ? 'h3' : 'h2';

    return (
        <div
            className={classNames(styles.container, {
                [styles.small]: size === 'small',
                [styles.medium]: size === 'medium',
                [styles.big]: size === 'big',
            })}
        >
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
                {categories.length > 0 && (
                    <div className={styles.categories}>
                        <CategoriesList
                            categories={categories}
                            showAllCategories={size !== 'small'}
                            isStatic
                        />
                    </div>
                )}
                <HeadingTag className={styles.title}>
                    <Link href={`/${story.slug}`} locale={false} passHref>
                        <a className={styles.titleLink}>{title}</a>
                    </Link>
                </HeadingTag>

                {subtitle && showSubtitle && (
                    <p className={styles.subtitle}>
                        <Link href={`/${story.slug}`} locale={false} passHref>
                            <a className={styles.titleLink}>{subtitle}</a>
                        </Link>
                    </p>
                )}

                {showDate && (
                    <p className={styles.date}>
                        <StoryPublicationDate story={story} />
                    </p>
                )}
            </div>
        </div>
    );
}

export default StoryCard;
