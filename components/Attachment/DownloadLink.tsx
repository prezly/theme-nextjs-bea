import { actionDownload } from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { IconDownload } from 'icons';

import styles from './DownloadLink.module.scss';

interface Props {
    className: string;
}

const DownloadLink: FunctionComponent<Props> = ({ className }) => (
    <div className={classNames(styles.link, className)}>
        <FormattedMessage {...actionDownload} />
        <IconDownload className={styles.icon} />
    </div>
);

export default DownloadLink;
