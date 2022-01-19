import { NodeRenderer } from '@prezly/content-renderer-react-js';
import { AttachmentNode, UploadcareFile } from '@prezly/slate-types';

import { STORY_FILE, useAnalytics } from '@/modules/analytics';

import DownloadLink from './DownloadLink';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes } from './utils';

import styles from './Attachment.module.scss';

const Attachment: NodeRenderer<AttachmentNode> = ({ node }) => {
    const { track } = useAnalytics();
    const { file, description } = node;
    const { downloadUrl } = UploadcareFile.createFromPrezlyStoragePayload(file);
    const displayedName = description || file.filename;
    const fileExtension = file.filename.split('.').pop();
    const fileType = fileExtension?.toUpperCase();

    const handleClick = () => {
        track(STORY_FILE.DOWNLOAD, { id: file.uuid });
    };

    return (
        <a className={styles.container} href={downloadUrl} onClick={handleClick}>
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
};

export default Attachment;
