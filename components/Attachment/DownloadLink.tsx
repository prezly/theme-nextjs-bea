import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { IconDownload } from 'icons';

import styles from './DownloadLink.module.scss';

interface Props {
    className: string;
    downloadUrl: string;
}

const DownloadLink: FunctionComponent<Props> = ({ className, downloadUrl }) => (
    <a href={downloadUrl} className={classNames(styles.link, className)}>
        Download
        <IconDownload className={styles.icon} />
    </a>
);

export default DownloadLink;
