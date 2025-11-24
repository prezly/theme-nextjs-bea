import { IconExternalLink, IconImage } from '@/icons';
import styles from './PlaceholderGallery.module.scss';

interface Props {
    title: string;
    newsroomUuid: string;
}

export function PlaceholderGallery({ title, newsroomUuid }: Props) {
    const createGalleryUrl = `https://rock.prezly.com/sites/${newsroomUuid}/settings/galleries?overlay=site.${newsroomUuid}.gallery-create.image`;

    return (
        <a href={createGalleryUrl} className={styles.wrapper} rel="noopener" target="_blank">
            <div className={styles.imageWrapper}>
                <IconImage />
            </div>
            <p className={styles.title}>{title}</p>
            <p className={styles.createGalleryText}>
                Create gallery <IconExternalLink className={styles.icon} />
            </p>
        </a>
    );
}
