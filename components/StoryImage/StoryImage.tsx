'use client';

import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import type { ListStory } from 'types';
import { getUploadcareImage } from 'utils';

import { useFallback } from './FallbackProvider';
import { type CardSize, getCardImageSizes, getStoryThumbnail } from './lib';

import styles from './StoryImage.module.scss';

type Props = {
    className?: string;
    isStatic?: boolean;
    placeholderClassName?: string;
    size: CardSize;
    story: Pick<ListStory, 'title' | 'thumbnail_image'>;
};

export function StoryImage({
    className,
    isStatic = false,
    placeholderClassName,
    size,
    story,
}: Props) {
    const fallback = useFallback();
    const image = getStoryThumbnail(story);
    const uploadcareImage = getUploadcareImage(image);

    if (uploadcareImage) {
        return (
            <div className={classNames(styles.imageContainer, className)}>
                <UploadcareImage
                    fill
                    alt={story.title}
                    className={classNames(styles.image, {
                        [styles.static]: isStatic,
                    })}
                    src={uploadcareImage.cdnUrl}
                    sizes={getCardImageSizes(size)}
                />
            </div>
        );
    }

    const fallbackImage = getUploadcareImage(fallback.image);

    return (
        <span className={classNames(styles.placeholder, placeholderClassName)}>
            {fallbackImage ? (
                <UploadcareImage
                    alt="No image"
                    src={fallbackImage.cdnUrl}
                    className={classNames(styles.imageContainer, styles.placeholderLogo, className)}
                    width={256}
                    height={64}
                />
            ) : (
                fallback.text
            )}
        </span>
    );
}
