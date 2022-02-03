import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getUploadcareGroupUrl } from '@prezly/theme-kit-nextjs';

import { SlateRenderer } from '@/components';

import Layout from '../Layout';

import DownloadLink from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    gallery: NewsroomGallery;
}

function Gallery({ gallery }: Props) {
    const { content, images, title, uploadcare_group_uuid } = gallery;

    return (
        <Layout title={title} imageUrl={getAssetsUrl(images[0].uploadcare_image.uuid)}>
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                {uploadcare_group_uuid && (
                    <DownloadLink href={getUploadcareGroupUrl(uploadcare_group_uuid, title)} />
                )}
                <div className={styles.divider} />
                <SlateRenderer nodes={JSON.parse(content)} />
            </div>
        </Layout>
    );
}

export default Gallery;
