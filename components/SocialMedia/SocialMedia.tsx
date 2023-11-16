import type { NewsroomCompanyInformation } from '@prezly/sdk';
import classNames from 'classnames';

import {
    IconFacebook,
    IconInstagram,
    IconLinkedin,
    IconPinterest,
    IconTikTok,
    IconTwitter,
    IconYoutube,
} from '@/icons';

import { getSocialLinks } from './utils';

import styles from './SocialMedia.module.scss';

type Props = {
    className?: string;
    companyInformation: NewsroomCompanyInformation;
};

export function SocialMedia({ className, companyInformation }: Props) {
    const { facebook, instagram, linkedin, pinterest, tiktok, twitter, youtube } =
        getSocialLinks(companyInformation);

    return (
        <div className={classNames(className, styles.container)}>
            {facebook && (
                <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    aria-label="Facebook"
                    className={styles.link}
                >
                    <IconFacebook width={24} height={24} className={styles.icon} />
                </a>
            )}
            {instagram && (
                <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    aria-label="Instagram"
                    className={styles.link}
                >
                    <IconInstagram width={24} height={24} className={styles.icon} />
                </a>
            )}
            {linkedin && (
                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    className={styles.link}
                >
                    <IconLinkedin width={24} height={24} className={styles.icon} />
                </a>
            )}
            {pinterest && (
                <a
                    href={pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Pinterest"
                    aria-label="Pinterest"
                    className={styles.link}
                >
                    <IconPinterest width={24} height={24} className={styles.icon} />
                </a>
            )}
            {tiktok && (
                <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok"
                    aria-label="TikTok"
                    className={styles.link}
                >
                    <IconTikTok width={24} height={24} className={styles.icon} />
                </a>
            )}
            {twitter && (
                <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="X"
                    aria-label="X"
                    className={styles.link}
                >
                    <IconTwitter width={24} height={24} className={styles.icon} />
                </a>
            )}
            {youtube && (
                <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Youtube"
                    aria-label="Youtube"
                    className={styles.link}
                >
                    <IconYoutube width={24} height={24} className={styles.icon} />
                </a>
            )}
        </div>
    );
}
