'use client';

import { useTransparencyBackdrop } from '@prezly/content-renderer-react-js';
import type { UploadedImage } from '@prezly/uploadcare';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';
import { useMemo, useRef } from 'react';

import { getUploadcareImage } from '@/utils';

import styles from './GalleryCard.module.scss';

interface Props {
    cover: UploadedImage;
}

export function GalleryCardThumbnail({ cover }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const coverImage = useMemo(() => getUploadcareImage(cover), [cover]);
    const hasTransparencyBackdrop = useTransparencyBackdrop(coverImage, wrapperRef);

    if (!coverImage) {
        return null;
    }

    return (
        <div className={styles.thumbnailWrapper} ref={wrapperRef}>
            <UploadcareImage
                fill
                // we don't need alt text here since the album name is part of the same link
                alt=""
                className={classNames(styles.thumbnail, {
                    [styles.transparencyBackdrop]: hasTransparencyBackdrop,
                })}
                src={coverImage.cdnUrl}
                sizes="(max-width: 1023px) 90vw, 580px"
            />
        </div>
    );
}
