'use client';

import type { UploadcareImage } from '@prezly/uploadcare';
import UploadcareImageLoader from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import type { ListStory } from 'types';
import { getUploadcareImage } from 'utils';

import { useFallback } from './FallbackProvider';
import { getCardImageSizes, getStoryThumbnail, type ImageSize } from './lib';

import styles from './StoryImage.module.scss';

type Props = {
    aspectRatio?: number;
    className?: string;
    isStatic?: boolean;
    placeholderClassName?: string;
    size: ImageSize;
    thumbnailImage: ListStory['thumbnail_image'];
    title: string;
};

export function StoryImage({
    aspectRatio,
    className,
    isStatic = false,
    placeholderClassName,
    size,
    thumbnailImage,
    title,
}: Props) {
    const fallback = useFallback();
    const image = getStoryThumbnail(thumbnailImage);
    const uploadcareImage = applyAspectRatio(getUploadcareImage(image), aspectRatio);

    if (uploadcareImage) {
        return (
            <div className={classNames(styles.imageContainer, className)}>
                <UploadcareImageLoader
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
                <UploadcareImageLoader
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

function applyAspectRatio(
    image: UploadcareImage | null,
    aspectRatio: number | undefined,
): UploadcareImage | null {
    if (!image || !aspectRatio) {
        return image;
    }

    const actualAspectRatio = image.width / image.height;

    if (actualAspectRatio > aspectRatio * 2) {
        return image.scaleCrop(image.height * aspectRatio * 2, image.height, true);
    }

    if (actualAspectRatio < aspectRatio) {
        return image.scaleCrop(image.width, image.width / aspectRatio, true);
    }

    return image;
}
