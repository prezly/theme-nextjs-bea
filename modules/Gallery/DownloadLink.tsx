import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/server';
import { ButtonLink } from '@/components/Button';
import { IconDownload } from '@/icons';

import styles from './DownloadLink.module.scss';

interface Props {
    localeCode: Locale.Code;
    href: string;
}

export function DownloadLink({ localeCode, href }: Props) {
    return (
        <ButtonLink variation="primary" forceRefresh href={href} className={styles.link}>
            <FormattedMessage locale={localeCode} for={translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </ButtonLink>
    );
}
