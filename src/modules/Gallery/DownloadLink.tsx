'use client';

import { DOWNLOAD } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/client';
import { ButtonLink } from '@/components/Button';
import { IconDownload } from '@/icons';
import { analytics } from '@/utils';

import styles from './DownloadLink.module.scss';

interface Props {
    localeCode: Locale.Code;
    href: string;
}

export function DownloadLink({ localeCode, href }: Props) {
    function handleClick() {
        analytics.track(DOWNLOAD.MEDIA_GALLERY);
    }

    return (
        <ButtonLink
            download
            variation="primary"
            forceRefresh
            href={href}
            className={styles.link}
            onClick={handleClick}
            rel="nofollow"
        >
            <FormattedMessage locale={localeCode} for={translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </ButtonLink>
    );
}
