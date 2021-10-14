import { NewsroomCompanyInformation } from '@prezly/sdk';
import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import {
    IconFacebook,
    IconInstagram,
    IconLinkedin,
    IconPinterest,
    IconTikTok,
    IconTwitter,
    IconYoutube,
} from '@/icons';

import { hasSocialMedia } from './utils';

import styles from './SocialMedia.module.scss';

type Props = {
    className: string;
    companyInformation: NewsroomCompanyInformation;
};

const SocialMedia: FunctionComponent<Props> = ({ className, companyInformation }) => {
    if (!hasSocialMedia(companyInformation)) {
        return null;
    }

    const { facebook, instagram, linkedin, pinterest, tiktok, twitter, youtube } =
        companyInformation;

    return (
        <div className={classNames(className, styles.container)}>
            {facebook && (
                <a href="#" title="Facebook" className={styles.link}>
                    <IconFacebook className={styles.icon} />
                </a>
            )}
            {instagram && (
                <a href="#" title="Instagram" className={styles.link}>
                    <IconInstagram className={styles.icon} />
                </a>
            )}
            {linkedin && (
                <a href="#" title="LinkedIn" className={styles.link}>
                    <IconLinkedin className={styles.icon} />
                </a>
            )}
            {pinterest && (
                <a href="#" title="Pinterest" className={styles.link}>
                    <IconPinterest className={styles.icon} />
                </a>
            )}
            {tiktok && (
                <a href="#" title="TikTok" className={styles.link}>
                    <IconTikTok className={styles.icon} />
                </a>
            )}
            {twitter && (
                <a href="#" title="Twitter" className={styles.link}>
                    <IconTwitter className={styles.icon} />
                </a>
            )}
            {youtube && (
                <a href="#" title="Youtube" className={styles.link}>
                    <IconYoutube className={styles.icon} />
                </a>
            )}
        </div>
    );
};

export default SocialMedia;
