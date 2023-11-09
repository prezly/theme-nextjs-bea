import type { NewsroomGallery } from '@prezly/sdk';
import { getUploadcareGroupUrl } from '@prezly/theme-kit-core';

import { ContentRenderer } from '@/components/ContentRenderer';
import { StoryLinks } from '@/components/StoryLinks';

import { DownloadLink } from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    gallery: NewsroomGallery;
    href: string;
}

export function Gallery({ gallery, href }: Props) {
    const { content, name, uploadcare_group_uuid, description } = gallery;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{name}</h1>
            {description && <p className={styles.description}>{description}</p>}

            <div className={styles.links}>
                {uploadcare_group_uuid && (
                    <DownloadLink href={getUploadcareGroupUrl(uploadcare_group_uuid, name)} />
                )}
                <StoryLinks url={href} className={styles.shareLinks} />
            </div>

            <ContentRenderer nodes={JSON.parse(content)} />
        </div>
    );
}
