'use client';

import type { UploadedImage } from '@prezly/sdk';
import type { UploadcareImage } from '@prezly/uploadcare';
import UploadcareImageLoader from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import type { ListStory } from '@/types';
import { getUploadcareImage } from '@/utils';

import { getCardImageSizes, getStoryThumbnail, type ImageSize } from './lib';

import styles from './StoryImage.module.scss';

export function StoryImage({
    className,
    fallback,
    forceAspectRatio,
    isStatic = false,
    placeholder,
    placeholderClassName,
    size,
    thumbnailImage,
    title,
}: StoryImage.Props) {
    const image = getStoryThumbnail(thumbnailImage);
    const uploadcareImage = applyAspectRatio(getUploadcareImage(image), forceAspectRatio);

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
            style={placeholder}
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

export namespace StoryImage {
    export type Props = {
        className?: string;
        fallback: {
            image: UploadedImage | null;
            text: string;
        };
        forceAspectRatio?: number;
        isStatic?: boolean;
        placeholder: {
            color?: string;
            backgroundColor?: string;
        };
        placeholderClassName?: string;
        size: ImageSize;
        thumbnailImage: ListStory['thumbnail_image'];
        title: string;
    };
}

function applyAspectRatio(
    image: UploadcareImage | null,
    aspectRatio: number | undefined,
): UploadcareImage | null {
    if (!image || !aspectRatio) {
        return image;
    }

    const actualAspectRatio = image.width / image.height;

    if (actualAspectRatio > aspectRatio) {
        const [width, height] = constrain(Math.round(image.height * aspectRatio), image.height);
        // The image is wider than it should
        return image.scaleCrop(width, height, true);
    }

    if (actualAspectRatio < aspectRatio) {
        // The image is taller than it should
        const [width, height] = constrain(image.width, Math.round(image.width / aspectRatio));
        return image.scaleCrop(width, height, true);
    }

    return image;
}

const MAX_SCALED_SIZE = 3000;

/**
 * Scale down vectors, which has at least one of dimensions > 3000px.
 * This is necessary because Uploadcare scale_crop transformation fails if one of the dimensions is larger than 3000px.
 */
function constrain(width: number, height: number): [number, number] {
    if (width < MAX_SCALED_SIZE && height < MAX_SCALED_SIZE) {
        return [width, height];
    }
    return [
        Math.min(MAX_SCALED_SIZE, Math.round((width / height) * MAX_SCALED_SIZE)),
        Math.min(MAX_SCALED_SIZE, Math.round((height / width) * MAX_SCALED_SIZE)),
    ];
}
