'use client';

import classNames from 'classnames';
import {
    BlueskyShareButton,
    FacebookShareButton,
    PinterestShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from 'react-share';

import {
    IconBluesky,
    IconFacebook,
    IconLinkedin,
    IconMastodon,
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

    function handleMastodonShare() {
        const linkedInUrl = new URL('https://mastodon.social/share');
        const text = `${title}\n\n${summary}\n\n${url!}`;
        linkedInUrl.searchParams.set('text', text);
        window.open(linkedInUrl, '_blank');
    }

    return (
        <div className={classNames(className, styles.social, { [styles.withLabels]: withLabels })}>
            {socialNetworks.includes(SocialNetwork.LINKEDIN) && (
                // TODO: use library component once `react-share` is updated to use latest LinkedIn API
                // @see https://github.com/nygardk/react-share/issues/550
                // <LinkedinShareButton
                //     data-title="Share on Linkedin"
                //     className={styles.socialButton}
                //     title={title}
                //     summary={summary}
                //     url={url}
                // >
                //     <IconLinkedin className={styles.socialIcon} />
                // </LinkedinShareButton>
                <button
                    data-title="Share on Linkedin"
                    className={classNames(styles.socialButton, styles.customButton)}
                    onClick={handleLinkedinShare}
                >
                    <IconLinkedin className={styles.socialIcon} />
                </button>
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

            {socialNetworks.includes(SocialNetwork.MASTODON) || (
                <button
                    data-title="Share on Mastodon"
                    className={classNames(styles.socialButton, styles.customButton)}
                    onClick={handleMastodonShare}
                >
                    <IconMastodon className={styles.socialIcon} />
                </button>
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

            {socialNetworks.includes(SocialNetwork.BLUESKY) || (
                <BlueskyShareButton
                    data-title="Share on Bluesky"
                    className={styles.socialButton}
                    title={summary ? `${title}. ${summary}` : title}
                    url={url}
                >
                    <IconBluesky className={styles.socialIcon} />
                </BlueskyShareButton>
            )}
        </div>
    );
}
