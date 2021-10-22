import { UploadcareFile, UploadcareStoragePayload } from '@prezly/slate-types';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import { IconDownload } from 'icons';

import FileTypeIcon from './FileTypeIcon';
import { formatBytes } from './utils';

import styles from './Attachment.module.scss';

interface Props {
    description: string;
    file: UploadcareStoragePayload;
}

const Attachment: FunctionComponent<Props> = ({ description, file }) => {
    const { downloadUrl } = UploadcareFile.createFromPrezlyStoragePayload(file);
    const displayedName = description || file.filename;
    const fileExtension = file.filename.split('.').pop();
    const fileType = fileExtension?.toUpperCase();

    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                <FileTypeIcon extension={fileExtension} />
            </div>
            <div className={styles.content}>
                <h4 className={styles.name}>{displayedName}</h4>
                <h5 className={styles.type}>
                    {fileType}
                    {fileType && ' - '}
                    {formatBytes(file.size)}
                </h5>
            </div>
            <Button.Link
                className={styles.downloadLink}
                href={downloadUrl}
                icon={IconDownload}
                iconPlacement="right"
                variation="navigation"
            >
                Download
            </Button.Link>
        </div>
    );
};

export default Attachment;
