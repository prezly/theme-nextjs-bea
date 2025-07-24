'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import type { NewsroomGallery, Story } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { useIntl } from '@/adapters/client';
import {
    IconBluesky,
    IconFacebook,
    IconLinkedin,
    IconMastodon,
    IconPinterest,
    IconReddit,
    IconTelegram,
    IconThreads,
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

    function createUrlWithQuery(url: string, query: Record<string, string>) {
        const result = new URL(url);
        Object.entries(query).forEach(([key, value]) => {
            result.searchParams.set(key, value);
        });

        return result.toString();
    }

    function trackSharingEvent(socialNetwork: SocialNetwork) {
        analytics.track(ACTIONS.SHARE_TO_SOCIAL_NETWORK(trackingContext), {
            id: uuid,
            socialNetwork,
            enabledNetworks: socialNetworks,
        });
    }

    function capitalize(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function generateAriaLabel(socialNetwork: SocialNetwork) {
        return [formatMessage(translations.actions.share), capitalize(socialNetwork)].join(' ');
    }

    return (
        <div className={classNames(className, styles.social, { [styles.withLabels]: withLabels })}>
            {socialNetworks.includes(SocialNetwork.LINKEDIN) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.LINKEDIN)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://www.linkedin.com/sharing/share-offsite', {
                        url,
                        text: `${title}\n\n${summary}\n\n${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.LINKEDIN)}
                    target="_blank"
                >
                    <IconLinkedin className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.FACEBOOK) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.FACEBOOK)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://www.facebook.com/sharer/sharer.php', {
                        u: url,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.FACEBOOK)}
                    target="_blank"
                >
                    <IconFacebook className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.TWITTER) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.TWITTER)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://twitter.com/intent/tweet', {
                        url,
                        text: title,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.TWITTER)}
                    target="_blank"
                >
                    <IconTwitter className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.MASTODON) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.MASTODON)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://mastodon.social/share', {
                        text: `${title}\n\n${summary}\n\n${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.MASTODON)}
                    target="_blank"
                >
                    <IconMastodon className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.PINTEREST) && thumbnailUrl && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.PINTEREST)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://pinterest.com/pin/create/button/', {
                        url,
                        media: thumbnailUrl,
                        description: `${title}. ${summary}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.PINTEREST)}
                    target="_blank"
                >
                    <IconPinterest className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.REDDIT) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.REDDIT)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://www.reddit.com/submit', { title, url })}
                    onClick={() => trackSharingEvent(SocialNetwork.REDDIT)}
                    target="_blank"
                >
                    <IconReddit className={styles.socialIcon} />
                </a>
            )}

            {/* {socialNetworks.includes(SocialNetwork.MESSENGER) && (
                <FacebookMessengerShareButton data-title="Share on Messenger" className={styles.socialLink} appId="abc" url={url} onClick={() => trackSharingEvent(SocialNetwork.MESSENGER)}>
                    <IconMessenger className={styles.socialIcon} />
                </FacebookMessengerShareButton>
            )} */}

            {socialNetworks.includes(SocialNetwork.WHATSAPP) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.WHATSAPP)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://api.whatsapp.com/send', {
                        text: `${title} ${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.WHATSAPP)}
                    target="_blank"
                >
                    <IconWhatsApp className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.THREADS) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.THREADS)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://www.threads.net/intent/post', {
                        text: `${title} ${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.THREADS)}
                    target="_blank"
                >
                    <IconThreads className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.TELEGRAM) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.TELEGRAM)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://t.me/share/url', {
                        url,
                        text: title,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.TELEGRAM)}
                    target="_blank"
                >
                    <IconTelegram className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.BLUESKY) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.BLUESKY)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://bsky.app/intent/compose', {
                        text: `${title} ${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.BLUESKY)}
                    target="_blank"
                >
                    <IconBluesky className={styles.socialIcon} />
                </a>
            )}
        </div>
    );
}
