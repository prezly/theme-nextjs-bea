'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';

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

    // TODO add fallback image
    return null;
}
