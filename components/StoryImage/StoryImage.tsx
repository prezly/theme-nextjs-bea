'use client';

import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import type { ListStory } from 'types';
import { getUploadcareImage } from 'utils';

import { useFallback } from './FallbackProvider';
import { getCardImageSizes, getStoryThumbnail, type ImageSize } from './lib';

import styles from './StoryImage.module.scss';

type Props = {
    className?: string;
    isStatic?: boolean;
    placeholderClassName?: string;
    size: ImageSize;
    thumbnailImage: ListStory['thumbnail_image'];
    title: string;
};

export function StoryImage({
    className,
    isStatic = false,
    placeholderClassName,
    size,
    thumbnailImage,
    title,
}: Props) {
    const fallback = useFallback();
    const image = getStoryThumbnail(thumbnailImage);
    const uploadcareImage = getUploadcareImage(image);

    if (uploadcareImage) {
        return (
            <div className={classNames(styles.imageContainer, className)}>
                <UploadcareImage
                    fill
                    alt={title}
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
        <span
            className={classNames(styles.placeholder, placeholderClassName, {
                [styles.static]: isStatic,
            })}
        >
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
