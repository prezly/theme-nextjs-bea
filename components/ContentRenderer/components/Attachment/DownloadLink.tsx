import { translations } from '@prezly/theme-kit-intl';
import classNames from 'classnames';

import { IconDownload } from '@/icons';
import { FormattedMessage } from '@/theme/client';

import styles from './DownloadLink.module.scss';

interface Props {
    className: string;
}

export function DownloadLink({ className }: Props) {
    return (
        <div className={classNames(styles.link, className)}>
            <FormattedMessage for={translations.actions.download} />
            <IconDownload width={16} height={16} className={styles.icon} />
        </div>
    );
}
