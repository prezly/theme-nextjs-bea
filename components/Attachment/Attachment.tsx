import { UploadcareFile, UploadcareStoragePayload } from '@prezly/slate-types';
import React, { FunctionComponent } from 'react';

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
        <a className={styles.container} href={downloadUrl}>
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
        </a>
    );
};

export default Attachment;
