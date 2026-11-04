import type { Locale } from '@prezly/theme-kit-nextjs';
import { Galleries } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { Link } from '@/components/Link';
import type { PublicGallery } from '@/utils';

import styles from './GalleryCard.module.scss';
import { GalleryCardThumbnail } from './GalleryCardThumbnail';

interface Props {
    className?: string;
    gallery: PublicGallery;
    localeCode: Locale.Code;
}

export function GalleryCard({ className, gallery, localeCode }: Props) {
    const { name } = gallery;
    const cover = Galleries.getCoverImage(gallery);

    return (
        <Link
            href={{
                routeName: 'mediaGallery',
                params: { uuid: gallery.uuid, localeCode },
            }}
            className={classNames(styles.container, className)}
        >
            {cover && <GalleryCardThumbnail cover={cover} />}
            <span className={styles.title}>{name}</span>
        </Link>
    );
}
