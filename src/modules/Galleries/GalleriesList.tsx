import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { GalleryCard } from '@/components/GalleryCard';
import type { PublicGallery } from '@/utils';

import { getGalleriesLayout } from './lib';

import styles from './GalleriesList.module.scss';

type Props = {
    galleries: PublicGallery[];
    localeCode: Locale.Code;
};

export function GalleriesList({ galleries, localeCode }: Props) {
    const [firstRowColumns, secondRowColumns] = getGalleriesLayout(galleries.length);

    return (
        <div
            className={classNames(styles.grid, {
                [styles.twoColumns]: firstRowColumns === 2 && secondRowColumns < 3,
                [styles.threeColumns]: firstRowColumns === 3,
                [styles.twoByThreeColumns]: firstRowColumns === 2 && secondRowColumns === 3,
            })}
        >
            {galleries.map((gallery) => (
                <GalleryCard
                    className={styles.card}
                    key={gallery.uuid}
                    gallery={gallery}
                    localeCode={localeCode}
                />
            ))}
        </div>
    );
}
