import type { Newsroom } from '@prezly/sdk';

import { IconExternalLink } from '@/icons';

import styles from './LogoPlaceholder.module.scss';

interface Props {
    newsroom: Newsroom;
}

const BEA_THEME_UUID = '73015107-ac86-418b-9120-4ffa439d5c0f';

export function LogoPlaceholder({ newsroom }: Props) {
    const siteBrandingUrl = `https://rock.prezly.com/sites/${newsroom.uuid}/settings/themes/${BEA_THEME_UUID}`;

    return (
        <a
            href={siteBrandingUrl}
            className={styles.wrapper}
            rel="noopener noreferrer"
            target="_blank"
        >
            <span className={styles.newsroomName}>{newsroom.display_name}</span>
            <span className={styles.uploadText}>
                Upload a site logo <IconExternalLink className={styles.icon} />
            </span>
        </a>
    );
}
