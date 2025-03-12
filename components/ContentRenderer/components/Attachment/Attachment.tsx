'use client';

import { DOWNLOAD } from '@prezly/analytics-nextjs';
import type { UploadedFile } from '@prezly/sdk';
import type { AttachmentNode } from '@prezly/story-content-format';
import { UploadcareFile } from '@prezly/uploadcare';

import { analytics } from '@/utils';

import { DownloadLink } from './DownloadLink';
import { FileTypeIcon } from './FileTypeIcon';
import { formatBytes, getMimeTypeExtension } from './utils';

import styles from './Attachment.module.scss';

interface Props {
    node: AttachmentNode;
}

export function Attachment({ node }: Props) {
    const { file, description } = node;
    const { downloadUrl } = UploadcareFile.createFromPrezlyStoragePayload(file);
    const displayedName = description.trim() || file.filename;

    const fileType = getFileType(node.file);
    const details = [fileType, formatBytes(node.file.size)].filter(Boolean).join(' ').toUpperCase();

    function handleClick() {
        analytics.track(DOWNLOAD.ATTACHMENT, { id: file.uuid });
    }

    return (
        <a
            id={`attachment-${file.uuid}`}
            download
            className={styles.container}
            href={downloadUrl}
            onClick={handleClick}
            rel="nofollow"
        >
            <div className={styles.icon}>
                <FileTypeIcon extension={fileType} />
            </div>
            <div className={styles.content}>
                <h4 className={styles.name}>{displayedName}</h4>
                <h5 className={styles.meta}>{details}</h5>
            </div>
            <DownloadLink className={styles.downloadLink} />
        </a>
    );
}

function getFileType(file: UploadedFile): string {
    return (
        getMimeTypeExtension(file.mime_type) || file.filename.split('.').pop()?.toLowerCase() || ''
    );
}
