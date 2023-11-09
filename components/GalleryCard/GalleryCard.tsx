import type { NewsroomGallery } from '@prezly/sdk';
import { getGalleryThumbnail } from '@prezly/theme-kit-core';
import UploadcareImage from '@prezly/uploadcare-image';
import classNames from 'classnames';

import { Link } from '@/components/Link';

import styles from './GalleryCard.module.scss';

interface Props {
    className?: string;
    gallery: NewsroomGallery;
}

export function GalleryCard({ className, gallery }: Props) {
    const { name } = gallery;
    const cover = getGalleryThumbnail(gallery);

    return (
        <Link
            href={{
                routeName: 'mediaAlbum',
                params: { uuid: gallery.uuid },
            }}
            className={classNames(styles.container, className)}
        >
            {cover && (
                <UploadcareImage
                    className={styles.thumbnail}
                    lazy
                    layout="fill"
                    objectFit="cover"
                    imageDetails={cover}
                />
            )}
            <span className={styles.title}>{name}</span>
        </Link>
    );
}
