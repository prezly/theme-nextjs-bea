import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { IconDownload } from '@/icons';

import styles from './DownloadLink.module.scss';

interface Props {
    className: string;
}

export function DownloadLink({ className }: Props) {
    const locale = useLocale();

    return (
        <div className={classNames(styles.link, className)}>
            <FormattedMessage locale={locale} for={translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </div>
    );
}
