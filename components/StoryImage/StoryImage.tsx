'use client';

import type { AlgoliaStory } from '@prezly/theme-kit-core';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';

import { type CardSize, getCardImageSizes } from '@/utils';
import type { StoryWithImage } from 'types';

import { useFallback } from './FallbackProvider';
import { getStoryThumbnail } from './lib';

import styles from './StoryImage.module.scss';

type Props = {
    story: StoryWithImage | AlgoliaStory;
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
