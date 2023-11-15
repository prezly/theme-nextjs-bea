import type { NewsroomGallery } from '@prezly/sdk';
import { Galleries } from '@prezly/theme-kit-nextjs';

import { ContentRenderer } from '@/components/ContentRenderer';
import { StoryLinks } from '@/components/StoryLinks';

import { DownloadLink } from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    gallery: NewsroomGallery;
    href: string;
}

export function Gallery({ gallery, href }: Props) {
    const { name, description, content } = gallery;

    const downloadUrl =
        gallery.uploadcare_group_uuid &&
        Galleries.getArchiveDownloadUrl(gallery.uploadcare_group_uuid, gallery.name);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{name}</h1>
            {description && <p className={styles.description}>{description}</p>}

            <div className={styles.links}>
                {downloadUrl && <DownloadLink href={downloadUrl} />}
                <StoryLinks url={href} className={styles.shareLinks} />
            </div>

            <ContentRenderer nodes={JSON.parse(content)} />
        </div>
    );
}
