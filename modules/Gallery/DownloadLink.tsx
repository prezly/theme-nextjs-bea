import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { IconDownload } from 'icons';

import styles from './DownloadLink.module.scss';

interface Props {
    href: string;
}

const messages = defineMessages({
    actionDownload: {
        defaultMessage: 'Download',
    },
});

const DownloadLink: FunctionComponent<Props> = ({ href }) => (
    <a href={href} className={styles.link}>
        <FormattedMessage {...messages.actionDownload} />
        <IconDownload className={styles.icon} />
    </a>
);

export default DownloadLink;
