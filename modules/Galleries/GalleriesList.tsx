import { NewsroomGallery } from '@prezly/sdk';
import { FunctionComponent } from 'react';

import GalleryCard from '@/components/GalleryCard';

import styles from './GalleriesList.module.scss';

type Props = {
    galleries: NewsroomGallery[];
};

const GalleriesList: FunctionComponent<Props> = ({ galleries }) => (
    <div className={styles.container}>
        {galleries.map((gallery) => (
            <GalleryCard key={gallery.uuid} gallery={gallery} />
        ))}
    </div>
);

export default GalleriesList;
