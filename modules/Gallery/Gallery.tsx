import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getUploadcareGroupUrl } from '@prezly/theme-kit-core';
import { useEffect, useState } from 'react';

import { ContentRenderer, StoryLinks } from '@/components';

import Layout from '../Layout';

import DownloadLink from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    gallery: NewsroomGallery;
}

function Gallery({ gallery }: Props) {
    const { content, images, name, uploadcare_group_uuid, description } = gallery;

    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(window.location.href);
        }
    }, []);

    return (
        <Layout title={name} imageUrl={getAssetsUrl(images[0].uploadcare_image.uuid)}>
            <div className={styles.container}>
                <h1 className={styles.title}>{name}</h1>
                {description && <p className={styles.description}>{description}</p>}

                <div className={styles.links}>
                    {uploadcare_group_uuid && (
                        <DownloadLink href={getUploadcareGroupUrl(uploadcare_group_uuid, name)} />
                    )}
                    <StoryLinks url={url} className={styles.shareLinks} />
                </div>

                <ContentRenderer nodes={JSON.parse(content)} />
            </div>
        </Layout>
    );
}

export default Gallery;
