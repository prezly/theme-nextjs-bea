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
    text: string;
    url: string | null;
    className?: string;
    socialNetworks: ThemeSettings['sharing_actions'];
    thumbnailUrl?: string;
    withLabels?: boolean;
    trackingContext: 'Story Page Header' | 'Story Page Footer' | 'Gallery';
    uuid: Story['uuid'] | NewsroomGallery['uuid'];
}

export function SocialShare({
    text,
    url,
    className,
    socialNetworks,
    thumbnailUrl,
    trackingContext,
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
                        text,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.LINKEDIN)}
                    rel="noopener noreferrer"
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
                    rel="noopener noreferrer"
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
                        text,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.TWITTER)}
                    rel="noopener noreferrer"
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
                        text: `${text}\n\n${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.MASTODON)}
                    rel="noopener noreferrer"
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
                        description: text,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.PINTEREST)}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <IconPinterest className={styles.socialIcon} />
                </a>
            )}

            {socialNetworks.includes(SocialNetwork.REDDIT) && (
                <a
                    aria-label={generateAriaLabel(SocialNetwork.REDDIT)}
                    className={styles.socialLink}
                    href={createUrlWithQuery('https://www.reddit.com/submit', { title: text, url })}
                    onClick={() => trackSharingEvent(SocialNetwork.REDDIT)}
                    rel="noopener noreferrer"
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
                        text: `${text} ${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.WHATSAPP)}
                    rel="noopener noreferrer"
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
                        text: `${text} ${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.THREADS)}
                    rel="noopener noreferrer"
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
                        text,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.TELEGRAM)}
                    rel="noopener noreferrer"
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
                        text: `${text} ${url}`,
                    })}
                    onClick={() => trackSharingEvent(SocialNetwork.BLUESKY)}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <IconBluesky className={styles.socialIcon} />
                </a>
            )}
        </div>
    );
}
