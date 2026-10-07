'use client';

import type { UploadedImage } from '@prezly/sdk';
import UploadcareImageLoader from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import type { ListStory } from '@/types';
import { getUploadcareImage } from '@/utils';

import { getCardImageSizes, getStoryThumbnail, type ImageSize } from './lib';

import styles from './StoryImage.module.scss';

export function StoryImage({
    className,
    fallback,
    isStatic = false,
    placeholder,
    placeholderClassName,
    size,
    thumbnailImage,
    title,
}: StoryImage.Props) {
    const image = getStoryThumbnail(thumbnailImage);
    const uploadcareImage = getUploadcareImage(image);

    if (uploadcareImage) {
        return (
            <div className={classNames(styles.imageContainer, className)} style={placeholder}>
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
                    alt={fallback.text}
                    src={fallbackImage.cdnUrl}
                    className={classNames(styles.imageContainer, styles.placeholderLogo, className)}
                    width={fallbackImage.width}
                    height={fallbackImage.height}
                    sizes={size === 'tiny' ? '60px' : '256px'}
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
