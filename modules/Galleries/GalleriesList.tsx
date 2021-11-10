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

    return (
        <div className={styles.container}>
            <div
                className={classNames(styles.grid, {
                    [styles.twoColumns]: firstRowColumns === 2,
                    [styles.threeColumns]: firstRowColumns === 3,
                    [styles.twoByThreeColumns]: firstRowColumns === 2 && secondRowColumns === 3,
                })}
            >
                {galleries.map((gallery) => (
                    <GalleryCard className={styles.card} key={gallery.uuid} gallery={gallery} />
                ))}
            </div>
        </div>
    );
};

export default GalleriesList;
