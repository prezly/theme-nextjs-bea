'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';

import { useFallback } from './FallbackProvider';
import { type CardSize, getCardImageSizes } from './lib';

import styles from './CategoryImage.module.scss';

type Props = {
    image: Category['image'];
    name: TranslatedCategory['name'];
    size: CardSize;
    className?: string;
};

export function CategoryImage({ image, name, size, className }: Props) {
    const fallback = useFallback();

    if (image) {
        return (
            <Image
                imageDetails={image}
                alt={name}
                layout="fill"
                objectFit="cover"
                containerClassName={classNames(styles.imageContainer, className)}
                className={styles.image}
                sizes={getCardImageSizes(size)}
            />
        );
    }

    return (
        <span className={styles.placeholder}>
            {fallback.image ? (
                <Image
                    imageDetails={fallback.image}
                    layout="fill"
                    objectFit="contain"
                    alt="No image"
                    containerClassName={classNames(styles.imageContainer, className)}
                    className={classNames(styles.image, styles.placeholderLogo, className)}
                    sizes={getCardImageSizes(size)}
                />
            ) : (
                fallback.text
            )}
        </span>
    );
}
