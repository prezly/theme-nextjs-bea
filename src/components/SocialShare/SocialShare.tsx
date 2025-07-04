'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import type { NewsroomGallery, Story } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
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

import { useIntl } from '@/adapters/client';
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
import { SocialNetwork, type ThemeSettings } from '@/theme-settings';
import { analytics } from '@/utils';

import styles from './SocialShare.module.scss';

interface Props {
    summary?: string;
    title: string;
    url: string | null;
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
    summary,
    thumbnailUrl,
    title,
    trackingContext,
    url,
    withLabels,
    uuid,
}: Props) {
    const { formatMessage } = useIntl();

    if (socialNetworks.length === 0 || !url) {
        return null;
    }

    function handleLinkedinShare() {
        trackSharingEvent(SocialNetwork.LINKEDIN);
        const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite');
        linkedInUrl.searchParams.set('url', url!);
        linkedInUrl.searchParams.set('text', `${title}\n\n${summary}`);
        window.open(linkedInUrl, '_blank');
    }

    function handleMastodonShare() {
        trackSharingEvent(SocialNetwork.MASTODON);
        const linkedInUrl = new URL('https://mastodon.social/share');
        const text = `${title}\n\n${summary}\n\n${url!}`;
        linkedInUrl.searchParams.set('text', text);
        window.open(linkedInUrl, '_blank');
    }

    function trackSharingEvent(socialNetwork: SocialNetwork) {
        analytics.track(ACTIONS.SHARE_TO_SOCIAL_NETWORK(trackingContext), {
            id: uuid,
            socialNetwork,
            enabledNetworks: socialNetworks,
        });
    }

    function generateAriaLabel(socialNetwork: SocialNetwork) {
        return [formatMessage(translations.actions.share), socialNetwork].join(' ');
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
                //     onClick={() => trackSharingEvent(SocialNetwork.LINKEDIN)}
                // >
                //     <IconLinkedin className={styles.socialIcon} />
                // </LinkedinShareButton>
                <button
                    aria-label={generateAriaLabel(SocialNetwork.LINKEDIN)}
                    className={classNames(styles.socialButton, styles.customButton)}
                    onClick={handleLinkedinShare}
                >
                    <IconLinkedin className={styles.socialIcon} />
                </button>
            )}

            {socialNetworks.includes(SocialNetwork.FACEBOOK) && (
                <FacebookShareButton
                    aria-label={generateAriaLabel(SocialNetwork.FACEBOOK)}
                    className={styles.socialButton}
                    url={url}
                    onClick={() => trackSharingEvent(SocialNetwork.FACEBOOK)}
                >
                    <IconFacebook className={styles.socialIcon} />
                </FacebookShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.TWITTER) && (
                <TwitterShareButton
                    aria-label={generateAriaLabel(SocialNetwork.TWITTER)}
                    className={styles.socialButton}
                    title={title}
                    url={url}
                    onClick={() => trackSharingEvent(SocialNetwork.TWITTER)}
                >
                    <IconTwitter className={styles.socialIcon} />
                </TwitterShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.MASTODON) && (
                <button
                    aria-label={generateAriaLabel(SocialNetwork.MASTODON)}
                    className={classNames(styles.socialButton, styles.customButton)}
                    onClick={handleMastodonShare}
                >
                    <IconMastodon className={styles.socialIcon} />
                </button>
            )}

            {socialNetworks.includes(SocialNetwork.PINTEREST) && thumbnailUrl && (
                <PinterestShareButton
                    aria-label={generateAriaLabel(SocialNetwork.PINTEREST)}
                    className={styles.socialButton}
                    media={thumbnailUrl}
                    description={`${title}. ${summary}`}
                    url={url}
                    onClick={() => trackSharingEvent(SocialNetwork.PINTEREST)}
                >
                    <IconPinterest className={styles.socialIcon} />
                </PinterestShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.REDDIT) && (
                <RedditShareButton
                    aria-label={generateAriaLabel(SocialNetwork.REDDIT)}
                    className={styles.socialButton}
                    title={title}
                    url={url}
                    onClick={() => trackSharingEvent(SocialNetwork.REDDIT)}
                >
                    <IconReddit className={styles.socialIcon} />
                </RedditShareButton>
            )}

            {/* {socialNetworks.includes(SocialNetwork.MESSENGER) && (
                <FacebookMessengerShareButton data-title="Share on Messenger" className={styles.socialButton} appId="abc" url={url} onClick={() => trackSharingEvent(SocialNetwork.MESSENGER)}>
                    <IconMessenger className={styles.socialIcon} />
                </FacebookMessengerShareButton>
            )} */}

            {socialNetworks.includes(SocialNetwork.WHATSAPP) && (
                <WhatsappShareButton
                    aria-label={generateAriaLabel(SocialNetwork.WHATSAPP)}
                    className={styles.socialButton}
                    title={title}
                    url={url}
                    onClick={() => trackSharingEvent(SocialNetwork.WHATSAPP)}
                >
                    <IconWhatsApp className={styles.socialIcon} />
                </WhatsappShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.TELEGRAM) && (
                <TelegramShareButton
                    aria-label={generateAriaLabel(SocialNetwork.TELEGRAM)}
                    className={styles.socialButton}
                    title={title}
                    url={url}
                    onClick={() => trackSharingEvent(SocialNetwork.TELEGRAM)}
                >
                    <IconTelegram className={styles.socialIcon} />
                </TelegramShareButton>
            )}

            {socialNetworks.includes(SocialNetwork.BLUESKY) && (
                <BlueskyShareButton
                    aria-label={generateAriaLabel(SocialNetwork.BLUESKY)}
                    className={styles.socialButton}
                    title={summary ? `${title}. ${summary}` : title}
                    url={url}
                    onClick={() => trackSharingEvent(SocialNetwork.BLUESKY)}
                >
                    <IconBluesky className={styles.socialIcon} />
                </BlueskyShareButton>
            )}
        </div>
    );
}
