'use client';

import classNames from 'classnames';
import {
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from 'react-share';

import {
    IconFacebook,
    IconLinkedin,
    IconPinterest,
    IconReddit,
    IconTelegram,
    IconTwitter,
    IconWhatsApp,
} from '@/icons';
import type { SharingOptions } from 'theme-settings';

import styles from './Share.module.scss';

interface Props {
    sharingOptions: SharingOptions;
    thumbnailUrl?: string;
    url: string;
}

export function Share({ thumbnailUrl, sharingOptions, url }: Props) {
    const socialShareButtonsCount = [
        sharingOptions.share_to_linkedin,
        sharingOptions.share_to_facebook,
        sharingOptions.share_to_twitter,
        sharingOptions.share_to_pinterest && thumbnailUrl,
        sharingOptions.share_to_reddit,
        sharingOptions.share_to_messenger,
        sharingOptions.share_to_whatsapp,
        sharingOptions.share_to_whatsapp,
        sharingOptions.share_to_bluesky,
    ].filter(Boolean).length;

    return (
        <div>
            <h2>Share</h2>

            <div
                className={classNames(styles.social, {
                    [styles.withLabels]: socialShareButtonsCount <= 2,
                })}
            >
                {sharingOptions.share_to_linkedin && (
                    <LinkedinShareButton
                        data-title="Share on Linkedin"
                        className={styles.socialButton}
                        url={url}
                    >
                        <IconLinkedin className={styles.socialIcon} />
                    </LinkedinShareButton>
                )}

                {sharingOptions.share_to_facebook && (
                    <FacebookShareButton
                        data-title="Share on Facebook"
                        className={styles.socialButton}
                        url={url}
                    >
                        <IconFacebook className={styles.socialIcon} />
                    </FacebookShareButton>
                )}

                {sharingOptions.share_to_twitter && (
                    <TwitterShareButton
                        data-title="Share on X"
                        className={styles.socialButton}
                        url={url}
                    >
                        <IconTwitter className={styles.socialIcon} />
                    </TwitterShareButton>
                )}

                {sharingOptions.share_to_pinterest && thumbnailUrl && (
                    <PinterestShareButton
                        data-title="Share on Pinterest"
                        className={styles.socialButton}
                        media={thumbnailUrl}
                        url={url}
                    >
                        <IconPinterest className={styles.socialIcon} />
                    </PinterestShareButton>
                )}

                {sharingOptions.share_to_reddit && (
                    <RedditShareButton
                        data-title="Share on Reddit"
                        className={styles.socialButton}
                        url={url}
                    >
                        <IconReddit className={styles.socialIcon} />
                    </RedditShareButton>
                )}

                {/* {sharingOptions.share_to_messenger && (
                    <FacebookMessengerShareButton data-title="Share on Messenger" className={styles.socialButton} appId="abc" url={url}>
                        <IconMessenger className={styles.socialIcon} />
                    </FacebookMessengerShareButton>
                )} */}

                {sharingOptions.share_to_whatsapp && (
                    <WhatsappShareButton
                        data-title="Share on WhatsApp"
                        className={styles.socialButton}
                        url={url}
                    >
                        <IconWhatsApp className={styles.socialIcon} />
                    </WhatsappShareButton>
                )}

                {sharingOptions.share_to_telegram && (
                    <TelegramShareButton
                        data-title="Share on Telegram"
                        className={styles.socialButton}
                        url={url}
                    >
                        <IconTelegram className={styles.socialIcon} />
                    </TelegramShareButton>
                )}

                {/* {sharingOptions.share_to_bluesky && (
                    Add it as soon as react-share merges the PR:
                    https://github.com/nygardk/react-share/pull/549
                )} */}
            </div>
        </div>
    );
}
