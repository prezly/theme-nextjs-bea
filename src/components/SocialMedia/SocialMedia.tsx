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
    isPreview?: boolean;
};

export function SocialMedia({ className, companyInformation, isPreview = false }: Props) {
    const { facebook, instagram, linkedin, pinterest, tiktok, twitter, youtube } =
        getSocialLinks(companyInformation);

    return (
        <div className={classNames(className, styles.container)}>
            {(facebook || isPreview) && (
                <a
                    href={facebook ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    aria-label="Facebook"
                    className={classNames(styles.link, { [styles.preview]: !facebook })}
                >
                    <IconFacebook width={24} height={24} className={styles.icon} />
                </a>
            )}
            {(instagram || isPreview) && (
                <a
                    href={instagram ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    aria-label="Instagram"
                    className={classNames(styles.link, { [styles.preview]: !instagram })}
                >
                    <IconInstagram width={24} height={24} className={styles.icon} />
                </a>
            )}
            {(linkedin || isPreview) && (
                <a
                    href={linkedin ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    className={classNames(styles.link, { [styles.preview]: !linkedin })}
                >
                    <IconLinkedin width={24} height={24} className={styles.icon} />
                </a>
            )}
            {(pinterest || isPreview) && (
                <a
                    href={pinterest ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Pinterest"
                    aria-label="Pinterest"
                    className={classNames(styles.link, { [styles.preview]: !pinterest })}
                >
                    <IconPinterest width={24} height={24} className={styles.icon} />
                </a>
            )}
            {(tiktok || isPreview) && (
                <a
                    href={tiktok ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok"
                    aria-label="TikTok"
                    className={classNames(styles.link, { [styles.preview]: !tiktok })}
                >
                    <IconTikTok width={24} height={24} className={styles.icon} />
                </a>
            )}
            {(twitter || isPreview) && (
                <a
                    href={twitter ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="X"
                    aria-label="X"
                    className={classNames(styles.link, { [styles.preview]: !twitter })}
                >
                    <IconTwitter width={24} height={24} className={styles.icon} />
                </a>
            )}
            {(youtube ?? isPreview) && (
                <a
                    href={youtube ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Youtube"
                    aria-label="Youtube"
                    className={classNames(styles.link, { [styles.preview]: !youtube })}
                >
                    <IconYoutube width={24} height={24} className={styles.icon} />
                </a>
            )}
        </div>
    );
}
