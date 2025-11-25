import { IconImage } from '@/icons';
import styles from './PlaceholderGallery.module.scss';

interface Props {
    title: string;
}

export function PlaceholderGallery({ title }: Props) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.imageWrapper}>
                <IconImage />
            </div>
            <p className={styles.title}>{title}</p>
        </div>
    );
}
