import { IconDownload } from '@prezly/icons';
import translations from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

import styles from './DownloadLink.module.scss';

interface Props {
    href: string;
}

function DownloadLink({ href }: Props) {
    return (
        <a href={href} className={styles.link}>
            <FormattedMessage {...translations.actions.download} />
            <IconDownload className={styles.icon} />
        </a>
    );
}

export default DownloadLink;
