import { IconDownload } from '@prezly/icons';
import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import styles from './DownloadLink.module.scss';

interface Props {
    className: string;
}

function DownloadLink({ className }: Props) {
    return (
        <div className={classNames(styles.link, className)}>
            <FormattedMessage {...translations.actions.download} />
            <IconDownload className={styles.icon} />
        </div>
    );
}

export default DownloadLink;
