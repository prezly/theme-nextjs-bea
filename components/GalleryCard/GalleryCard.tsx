import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Galleries } from '@prezly/theme-kit-nextjs';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { Link } from '@/components/Link';
import { getUploadcareImage } from '@/utils';

import styles from './GalleryCard.module.scss';

interface Props {
    className?: string;
    gallery: NewsroomGallery;
    localeCode: Locale.Code;
}

export function GalleryCard({ className, gallery, localeCode }: Props) {
    const { name } = gallery;
    const cover = Galleries.getCoverImage(gallery);
    const coverImage = getUploadcareImage(cover);

    return (
        <Link
            href={{
                routeName: 'mediaGallery',
                params: { uuid: gallery.uuid, localeCode },
            }}
            className={classNames(styles.container, className)}
        >
            {coverImage && (
                <div className={styles.thumbnailWrapper}>
                    <UploadcareImage
                        fill
                        alt={name}
                        className={styles.thumbnail}
                        src={coverImage.cdnUrl}
                        sizes="(max-width: 1023px) 90vw, 580px"
                    />
                </div>
            )}
            <span className={styles.title}>{name}</span>
        </Link>
    );
}
