import { IconDownload } from '@prezly/icons';
import translations from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

import { ButtonLink } from '@/ui';

import styles from './DownloadLink.module.scss';

interface Props {
    href: string;
}

function DownloadLink({ href }: Props) {
    return (
        <ButtonLink variation="primary" forceRefresh href={href} className={styles.link}>
            <FormattedMessage {...translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </ButtonLink>
    );
}

export default DownloadLink;
