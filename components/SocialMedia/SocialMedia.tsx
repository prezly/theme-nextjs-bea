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
    className: string;
    companyInformation: NewsroomCompanyInformation;
};

function SocialMedia({ className, companyInformation }: Props) {
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
                    className={styles.link}
                >
                    <IconFacebook className={styles.icon} />
                </a>
            )}
            {instagram && (
                <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    className={styles.link}
                >
                    <IconInstagram className={styles.icon} />
                </a>
            )}
            {linkedin && (
                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className={styles.link}
                >
                    <IconLinkedin className={styles.icon} />
                </a>
            )}
            {pinterest && (
                <a
                    href={pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Pinterest"
                    className={styles.link}
                >
                    <IconPinterest className={styles.icon} />
                </a>
            )}
            {tiktok && (
                <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok"
                    className={styles.link}
                >
                    <IconTikTok className={styles.icon} />
                </a>
            )}
            {twitter && (
                <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Twitter"
                    className={styles.link}
                >
                    <IconTwitter className={styles.icon} />
                </a>
            )}
            {youtube && (
                <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Youtube"
                    className={styles.link}
                >
                    <IconYoutube className={styles.icon} />
                </a>
            )}
        </div>
    );
}

export default SocialMedia;
