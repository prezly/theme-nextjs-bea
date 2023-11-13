'use client';

import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';

import type { ListStory } from 'types';

import { useFallback } from './FallbackProvider';
import { type CardSize, getCardImageSizes, getStoryThumbnail } from './lib';

import styles from './StoryImage.module.scss';

type Props = {
    story: Pick<ListStory, 'title' | 'thumbnail_image'>;
    size: CardSize;
    className?: string;
    placeholderClassName?: string;
};

export function StoryImage({ story, size, className, placeholderClassName }: Props) {
    const fallback = useFallback();
    const image = getStoryThumbnail(story);

    if (image) {
        return (
            <Image
                imageDetails={image}
                alt={story.title}
                layout="fill"
                objectFit="cover"
                containerClassName={classNames(styles.imageContainer, className)}
                className={styles.image}
                sizes={getCardImageSizes(size)}
            />
        );
    }

    return (
        <span className={classNames(styles.placeholder, placeholderClassName)}>
            {fallback.image ? (
                <Image
                    imageDetails={fallback.image}
                    layout="fill"
                    objectFit="contain"
                    alt="No image"
                    className={classNames(styles.imageContainer, styles.placeholderLogo, className)}
                    sizes={{ default: 256 }}
                />
            ) : (
                fallback.text
            )}
        </span>
    );
}
