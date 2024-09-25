'use client';

import { DOWNLOAD, useAnalytics } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { FormattedMessage } from '@/adapters/client';
import { ButtonLink } from '@/components/Button';
import { IconDownload } from '@/icons';

import styles from './DownloadLink.module.scss';

interface Props {
    localeCode: Locale.Code;
    href: string;
    disabled: boolean;
}

export function DownloadLink({ localeCode, href, disabled }: Props) {
    const { track } = useAnalytics();

    function handleClick() {
        track(DOWNLOAD.MEDIA_GALLERY);
    }

    return (
        <ButtonLink
            title={disabled ? 'Temporarily disabled due to system maintenance' : undefined}
            variation="primary"
            forceRefresh
            href={href}
            className={classNames(styles.link, {
                [styles.disabled]: disabled,
            })}
            onClick={handleClick}
        >
            <FormattedMessage locale={localeCode} for={translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </ButtonLink>
    );
}
