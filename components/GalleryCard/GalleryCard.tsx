import type { NewsroomGallery } from '@prezly/sdk';
import { getGalleryThumbnail } from '@prezly/theme-kit-core';
import { useGetLinkLocaleSlug } from '@prezly/theme-kit-nextjs';
import UploadcareImage from '@prezly/uploadcare-image';
import classNames from 'classnames';
import Link from 'next/link';

import styles from './GalleryCard.module.scss';

interface Props {
    className?: string;
    gallery: NewsroomGallery;
}

function GalleryCard({ className, gallery }: Props) {
    const { name, uuid } = gallery;
    const galleryThumbnail = getGalleryThumbnail(gallery);
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <Link
            href={`/media/album/${uuid}`}
            locale={getLinkLocaleSlug()}
            className={classNames(styles.container, className)}
            legacyBehavior
        >
            {galleryThumbnail && (
                <UploadcareImage
                    className={styles.thumbnail}
                    lazy
                    layout="fill"
                    objectFit="cover"
                    imageDetails={galleryThumbnail}
                />
            )}
            <span className={styles.title}>{name}</span>
        </Link>
    );
}

export default GalleryCard;
