'use client';

import { useAnalytics } from '@prezly/analytics-nextjs';
import type { NewsroomGallery, Story } from '@prezly/sdk';
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
import { SocialNetwork, type ThemeSettings } from 'theme-settings';

import styles from './SocialShare.module.scss';

interface Props {
    url: string;
    className?: string;
    socialNetworks: ThemeSettings['sharing_actions'];
    thumbnailUrl?: string;
    withLabels?: boolean;
    trackingContext: 'Story Page Header' | 'Story Page Footer' | 'Gallery';
    uuid: Story['uuid'] | NewsroomGallery['uuid'];
}

export function SocialShare({
    className,
    socialNetworks,
    thumbnailUrl,
    trackingContext,
    url,
    uuid,
    withLabels,
}: Props) {
    const { track } = useAnalytics();

    return (
        <div className={classNames(className, styles.social, { [styles.withLabels]: withLabels })}>
            {socialNetworks.includes(SocialNetwork.LINKEDIN) && (
                <LinkedinShareButton
                    data-title="Share on Linkedin"
                    className={styles.socialButton}
                    url={url}
                    onClick={() =>
                        track(
                            `Newsroom - ${trackingContext} - Share to ${SocialNetwork.LINKEDIN}`,
                            { id: uuid },
                        )
                    }
                >
                    <IconLinkedin className={styles.socialIcon} />
                </LinkedinShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.FACEBOOK) && (
                <FacebookShareButton
                    data-title="Share on Facebook"
                    className={styles.socialButton}
                    url={url}
                    onClick={() =>
                        track(
                            `Newsroom - ${trackingContext} - Share to ${SocialNetwork.FACEBOOK}`,
                            { id: uuid },
                        )
                    }
                >
                    <IconFacebook className={styles.socialIcon} />
                </FacebookShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.TWITTER) && (
                <TwitterShareButton
                    data-title="Share on X"
                    className={styles.socialButton}
                    url={url}
                    onClick={() =>
                        track(`Newsroom - ${trackingContext} - Share to ${SocialNetwork.TWITTER}`, {
                            id: uuid,
                        })
                    }
                >
                    <IconTwitter className={styles.socialIcon} />
                </TwitterShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.PINTEREST) && thumbnailUrl && (
                <PinterestShareButton
                    data-title="Share on Pinterest"
                    className={styles.socialButton}
                    media={thumbnailUrl}
                    url={url}
                    onClick={() =>
                        track(
                            `Newsroom - ${trackingContext} - Share to ${SocialNetwork.PINTEREST}`,
                            { id: uuid },
                        )
                    }
                >
                    <IconPinterest className={styles.socialIcon} />
                </PinterestShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.REDDIT) && (
                <RedditShareButton
                    data-title="Share on Reddit"
                    className={styles.socialButton}
                    url={url}
                    onClick={() =>
                        track(`Newsroom - ${trackingContext} - Share to ${SocialNetwork.REDDIT}`, {
                            id: uuid,
                        })
                    }
                >
                    <IconReddit className={styles.socialIcon} />
                </RedditShareButton>
            )}

            {/* {socialNetworks.includes(SocialNetwork.MESSENGER) && (
                <FacebookMessengerShareButton data-title="Share on Messenger" className={styles.socialButton} appId="abc" url={url}>
                    <IconMessenger className={styles.socialIcon} />
                </FacebookMessengerShareButton>
            )} */}

            {socialNetworks.includes(SocialNetwork.WHATSAPP) && (
                <WhatsappShareButton
                    data-title="Share on WhatsApp"
                    className={styles.socialButton}
                    url={url}
                    onClick={() =>
                        track(
                            `Newsroom - ${trackingContext} - Share to ${SocialNetwork.WHATSAPP}`,
                            { id: uuid },
                        )
                    }
                >
                    <IconWhatsApp className={styles.socialIcon} />
                </WhatsappShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.TELEGRAM) && (
                <TelegramShareButton
                    data-title="Share on Telegram"
                    className={styles.socialButton}
                    url={url}
                    onClick={() =>
                        track(
                            `Newsroom - ${trackingContext} - Share to ${SocialNetwork.TELEGRAM}`,
                            { id: uuid },
                        )
                    }
                >
                    <IconTelegram className={styles.socialIcon} />
                </TelegramShareButton>
            )}

            {/* {socialNetworks.includes(SocialNetwork.BLUESKY) && (
                Add it as soon as react-share merges the PR:
                https://github.com/nygardk/react-share/pull/549
            )} */}
        </div>
    );
}
