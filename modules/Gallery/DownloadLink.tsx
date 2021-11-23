import { actionDownload } from '@prezly/themes-intl-messages';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { IconDownload } from 'icons';

import styles from './DownloadLink.module.scss';

interface Props {
    href: string;
}

const DownloadLink: FunctionComponent<Props> = ({ href }) => (
    <a href={href} className={styles.link}>
        <FormattedMessage {...actionDownload} />
        <IconDownload className={styles.icon} />
    </a>
);

export default DownloadLink;
