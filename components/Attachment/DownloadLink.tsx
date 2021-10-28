import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { IconDownload } from 'icons';

import styles from './DownloadLink.module.scss';

interface Props {
    className: string;
}

const messages = defineMessages({
    actionDownload: {
        defaultMessage: 'Download',
    },
});

const DownloadLink: FunctionComponent<Props> = ({ className }) => (
    <div className={classNames(styles.link, className)}>
        <FormattedMessage {...messages.actionDownload} />
        <IconDownload className={styles.icon} />
    </div>
);

export default DownloadLink;
