import { translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/server';
import { ButtonLink } from '@/components/Button';
import { IconDownload } from '@/icons';

import styles from './DownloadLink.module.scss';

interface Props {
    href: string;
}

export function DownloadLink({ href }: Props) {
    return (
        <ButtonLink variation="primary" forceRefresh href={href} className={styles.link}>
            <FormattedMessage for={translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </ButtonLink>
    );
}
