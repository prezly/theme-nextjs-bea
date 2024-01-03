import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Galleries } from '@prezly/theme-kit-nextjs';
import UploadcareImage from '@prezly/uploadcare-image';
import classNames from 'classnames';

import { Link } from '@/components/Link';

import styles from './GalleryCard.module.scss';

interface Props {
    className?: string;
    gallery: NewsroomGallery;
    localeCode: Locale.Code;
}

export function GalleryCard({ className, gallery, localeCode }: Props) {
    const { name } = gallery;
    const cover = Galleries.getCoverImage(gallery);

    return (
        <Link
            href={{
                routeName: 'mediaAlbum',
                params: { uuid: gallery.uuid, localeCode },
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
