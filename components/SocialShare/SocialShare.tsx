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
import { SocialNetwork, type ThemeSettings } from 'theme-settings';

import styles from './SocialShare.module.scss';

interface Props {
    summary?: string;
    title: string;
    url: string | null;
    className?: string;
    socialNetworks: ThemeSettings['sharing_actions'];
    thumbnailUrl?: string;
    withLabels?: boolean;
}

export function SocialShare({
    className,
    socialNetworks,
    summary,
    thumbnailUrl,
    title,
    url,
    withLabels,
}: Props) {
    if (socialNetworks.length === 0 || !url) {
        return null;
    }

    function handleLinkedinShare() {
        const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite');
        linkedInUrl.searchParams.set('url', url!);
        linkedInUrl.searchParams.set('text', `${title}\n\n${summary}`);
        window.open(linkedInUrl, '_blank');
    }

    return (
        <div className={classNames(className, styles.social, { [styles.withLabels]: withLabels })}>
            {socialNetworks.includes(SocialNetwork.LINKEDIN) && (
                // TODO: update once `react-share` is updated to use latest LinkedIn API
                // `beforeOnClick` and `openShareDialogOnClick` are used as a temporary workaround
                // @see https://github.com/nygardk/react-share/issues/550
                <LinkedinShareButton
                    data-title="Share on Linkedin"
                    className={styles.socialButton}
                    title={title}
                    summary={summary}
                    url={url}
                    beforeOnClick={handleLinkedinShare}
                    openShareDialogOnClick={false}
                >
                    <IconLinkedin className={styles.socialIcon} />
                </LinkedinShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.FACEBOOK) && (
                <FacebookShareButton
                    data-title="Share on Facebook"
                    className={styles.socialButton}
                    url={url}
                >
                    <IconFacebook className={styles.socialIcon} />
                </FacebookShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.TWITTER) && (
                <TwitterShareButton
                    data-title="Share on X"
                    className={styles.socialButton}
                    title={title}
                    url={url}
                >
                    <IconTwitter className={styles.socialIcon} />
                </TwitterShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.PINTEREST) && thumbnailUrl && (
                <PinterestShareButton
                    data-title="Share on Pinterest"
                    className={styles.socialButton}
                    media={thumbnailUrl}
                    description={`${title}. ${summary}`}
                    url={url}
                >
                    <IconPinterest className={styles.socialIcon} />
                </PinterestShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.REDDIT) && (
                <RedditShareButton
                    data-title="Share on Reddit"
                    className={styles.socialButton}
                    title={title}
                    url={url}
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
                    title={title}
                    url={url}
                >
                    <IconWhatsApp className={styles.socialIcon} />
                </WhatsappShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.TELEGRAM) && (
                <TelegramShareButton
                    data-title="Share on Telegram"
                    className={styles.socialButton}
                    title={title}
                    url={url}
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
