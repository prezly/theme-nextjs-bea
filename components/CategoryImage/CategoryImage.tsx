'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { getUploadcareImage } from '@/utils';

import { useFallback } from './FallbackProvider';

import styles from './CategoryImage.module.scss';

type Props = {
    image: Category['image'];
    name: TranslatedCategory['name'];
    className?: string;
};

export function CategoryImage({ image, name, className }: Props) {
    const fallback = useFallback();
    const imageFile = getUploadcareImage(image);

    if (imageFile) {
        return (
            <div className={classNames(styles.imageContainer, className)}>
                <UploadcareImage
                    alt={name}
                    className={styles.image}
                    fill
                    sizes="(max-width: 430px) 180px, (max-width: 767px) 50vw, 350px"
                    src={imageFile.cdnUrl}
                />
            </div>
        );
    }

    const fallbackImage = getUploadcareImage(fallback.image);

    return (
        <span className={classNames(styles.placeholder, className)}>
            {fallbackImage ? (
                <UploadcareImage
                    alt="No image"
                    className={classNames(styles.image, styles.placeholderLogo)}
                    fill
                    sizes="320px"
                    src={fallbackImage.cdnUrl}
                />
            ) : (
                fallback.text
            )}
        </span>
    );
}
