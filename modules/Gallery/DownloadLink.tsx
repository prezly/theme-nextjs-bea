import { IconDownload } from '@prezly/icons';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import { FormattedMessage } from 'react-intl';

import styles from './DownloadLink.module.scss';

interface Props {
    href: string;
}

function DownloadLink({ href }: Props) {
    return (
        <Button.Link variation="primary" forceRefresh href={href} className={styles.link}>
            <FormattedMessage {...translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </Button.Link>
    );
}

export default DownloadLink;
