'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { useThemeSettings } from '@/adapters/client';
import { getUploadcareImage } from 'utils';

import styles from './CategoryImage.module.scss';

type Props = {
    image: Category['image'];
    name: TranslatedCategory['name'];
    className?: string;
};

export function CategoryImage({ image, name, className }: Props) {
    const { accent_color } = useThemeSettings();
    const imageFile = getUploadcareImage(image);

    if (imageFile) {
        return (
            <div className={classNames(styles.imageContainer, className)}>
                <UploadcareImage
                    alt={name}
                    className={styles.image}
                    fill
                    sizes="(max-width: 430px) 420px, (max-width: 767px) 350px, 600px"
                    src={imageFile.cdnUrl}
                />
            </div>
        );
    }

    return (
        <div
            className={classNames(className, styles.placeholder)}
            style={{ backgroundColor: accent_color }}
        />
    );
}
