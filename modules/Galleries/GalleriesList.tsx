import { NewsroomGallery } from '@prezly/sdk';
import classNames from 'classnames';
import { FunctionComponent } from 'react';

import GalleryCard from '@/components/GalleryCard';

import { getGalleriesLayout } from './lib';

import styles from './GalleriesList.module.scss';

type Props = {
    galleries: NewsroomGallery[];
};

const GalleriesList: FunctionComponent<Props> = ({ galleries }) => {
    const [firstRowColumns, secondRowColumns] = getGalleriesLayout(galleries.length);
    const firstRowGalleries = galleries.slice(0, firstRowColumns);
    const restOfGalleries = galleries.slice(firstRowColumns);

    return (
        <div className={styles.container}>
            <div
                className={classNames(styles.grid, {
                    [styles.twoColumns]: firstRowColumns === 2,
                    [styles.threeColumns]: firstRowColumns === 3,
                })}
            >
                {firstRowGalleries.map((gallery) => (
                    <GalleryCard key={gallery.uuid} gallery={gallery} />
                ))}
            </div>
            <div
                className={classNames(styles.grid, {
                    [styles.twoColumns]: secondRowColumns === 2,
                    [styles.threeColumns]: secondRowColumns === 3,
                })}
            >
                {restOfGalleries.map((gallery) => (
                    <GalleryCard key={gallery.uuid} gallery={gallery} />
                ))}
            </div>
        </div>
    );
};

export default GalleriesList;
