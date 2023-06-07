import { STORY_FILE, useAnalytics } from '@prezly/analytics-nextjs';
import type { AttachmentNode } from '@prezly/story-content-format';
import { UploadcareFile } from '@prezly/uploadcare';

import DownloadLink from './DownloadLink';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes } from './utils';

import styles from './Attachment.module.scss';

interface Props {
    node: AttachmentNode;
}

export function Attachment({ node }: Props) {
    const { track } = useAnalytics();
    const { file, description } = node;
    const { downloadUrl } = UploadcareFile.createFromPrezlyStoragePayload(file);
    const displayedName = description || file.filename;
    const fileExtension = file.filename.split('.').pop();
    const fileType = fileExtension?.toUpperCase();

    function handleClick() {
        track(STORY_FILE.DOWNLOAD, { id: file.uuid });
    }

    return (
        <a
            id={`attachment-${file.uuid}`}
            className={styles.container}
            href={downloadUrl}
            onClick={handleClick}
        >
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
            <DownloadLink className={styles.downloadLink} />
        </a>
    );
}
