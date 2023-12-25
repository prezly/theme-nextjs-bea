import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getGalleryThumbnail, getUploadcareGroupUrl } from '@prezly/theme-kit-core';
import { useEffect, useState } from 'react';

import { ContentRenderer, StoryLinks } from '@/components';

import Layout from '../Layout';

import DownloadLink from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    gallery: NewsroomGallery;
}

function Gallery({ gallery }: Props) {
    const { content, name, uploadcare_group_uuid: uploadcareGroupUuid, description } = gallery;
    const galleryThumbnail = getGalleryThumbnail(gallery);

    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(window.location.href);
        }
    }, []);

    return (
        <Layout
            title={name}
            imageUrl={galleryThumbnail ? getAssetsUrl(galleryThumbnail.uuid) : undefined}
        >
            <div className={styles.container}>
                <h1 className={styles.title}>{name}</h1>
                {description && <p className={styles.description}>{description}</p>}

                <div className={styles.links}>
                    {uploadcareGroupUuid && (
                        <DownloadLink href={getUploadcareGroupUrl(uploadcareGroupUuid, name)} />
                    )}
                    <StoryLinks url={url} className={styles.shareLinks} />
                </div>

                <ContentRenderer nodes={JSON.parse(content)} />
            </div>
        </Layout>
    );
}

export default Gallery;
