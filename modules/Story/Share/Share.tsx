'use client';

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

interface Props {
    sharingOptions: SharingOptions;
    screenshotUrl?: string;
    url: string;
}

export function Share({ screenshotUrl, sharingOptions, url }: Props) {
    return (
        <div>
            <h2>Share</h2>

            <div>
                {sharingOptions.share_to_linkedin && (
                    <LinkedinShareButton url={url}>
                        <IconLinkedin />
                    </LinkedinShareButton>
                )}

                {sharingOptions.share_to_facebook && (
                    <FacebookShareButton url={url}>
                        <IconFacebook />
                    </FacebookShareButton>
                )}

                {sharingOptions.share_to_twitter && (
                    <TwitterShareButton url={url}>
                        <IconTwitter />
                    </TwitterShareButton>
                )}

                {sharingOptions.share_to_pinterest && screenshotUrl && (
                    <PinterestShareButton media={screenshotUrl} url={url}>
                        <IconPinterest />
                    </PinterestShareButton>
                )}

                {sharingOptions.share_to_reddit && (
                    <RedditShareButton url={url}>
                        <IconReddit />
                    </RedditShareButton>
                )}

                {/* {sharingOptions.share_to_messenger && (
                    <FacebookMessengerShareButton appId="abc" url={url}>
                        <IconMessenger />
                    </FacebookMessengerShareButton>
                )} */}

                {sharingOptions.share_to_whatsapp && (
                    <TelegramShareButton url={url}>
                        <IconTelegram />
                    </TelegramShareButton>
                )}

                {sharingOptions.share_to_whatsapp && (
                    <WhatsappShareButton url={url}>
                        <IconWhatsApp />
                    </WhatsappShareButton>
                )}

                {/* {sharingOptions.share_to_bluesky && (
                    Add it as soon as react-share merges the PR:
                    https://github.com/nygardk/react-share/pull/549
                )} */}
            </div>
        </div>
    );
}
