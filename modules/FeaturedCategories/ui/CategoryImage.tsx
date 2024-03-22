'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';

import styles from './CategoryImage.module.scss';
import { useThemeSettings } from '@/adapters/client';

type Props = {
    image: Category['image'];
    name: TranslatedCategory['name'];
    className?: string;
};

export function CategoryImage({ image, name, className }: Props) {
    const { accent_color } = useThemeSettings();

    if (image) {
        return (
            <Image
                imageDetails={image}
                alt={name}
                layout="fill"
                objectFit="cover"
                containerClassName={classNames(styles.imageContainer, className)}
                className={styles.image}
                sizes={{
                    mobile: 420,
                    tablet: 350,
                    desktop: 600,
                    default: 600,
                }}
            />
        );
    }

    return (
        <div
            className={classNames(className, styles.placeholder)}
            style={{ backgroundColor: accent_color }}
        />
    );
}
