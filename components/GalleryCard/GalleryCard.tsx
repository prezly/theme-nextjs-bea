import { NewsroomGallery } from '@prezly/sdk';
import UploadcareImage from '@prezly/uploadcare-image';
import Link from 'next/link';
import { FunctionComponent } from 'react';

import styles from './GalleryCard.module.scss';

interface Props {
    gallery: NewsroomGallery;
}

const GalleryCard: FunctionComponent<Props> = ({ gallery }) => {
    const { title, images, uuid } = gallery;

    return (
        <Link href={`/gallery/${uuid}`} passHref>
            <a className={styles.container}>
                <UploadcareImage
                    className={styles.thumbnail}
                    lazy
                    layout="fill"
                    objectFit="cover"
                    imageDetails={images[0].uploadcare_image}
                />
                <span className={styles.title}>{title}</span>
            </a>
        </Link>
    );
};

export default GalleryCard;
