import type { NewsroomGallery } from '@prezly/sdk';
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
    const { name, images, uuid } = gallery;
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <Link href={`/media/album/${uuid}`} locale={getLinkLocaleSlug()} passHref>
            <a className={classNames(styles.container, className)}>
                <UploadcareImage
                    className={styles.thumbnail}
                    lazy
                    layout="fill"
                    objectFit="cover"
                    imageDetails={images[0].uploadcare_image}
                />
                <span className={styles.title}>{name}</span>
            </a>
        </Link>
    );
}

export default GalleryCard;
