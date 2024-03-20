'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';

import { useFallback } from './FallbackProvider';
import { type CardSize, getCardImageSizes } from './lib';

import styles from './CategoryImage.module.scss';

type Props = {
    category: Category;
    translatedCategory: TranslatedCategory;
    size: CardSize;
    className?: string;
};

export function CategoryImage({ category, translatedCategory, size, className }: Props) {
    const { image } = category;
    const fallback = useFallback();

    if (image) {
        return (
            <Image
                imageDetails={image}
                alt={translatedCategory.name}
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
                    className={classNames(styles.imageContainer, styles.placeholderLogo, className)}
                    sizes={{ default: 256 }}
                />
            ) : (
                fallback.text
            )}
        </span>
    );
}
