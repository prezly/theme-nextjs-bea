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

import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import {
    IconFacebook,
    IconFileDown,
    IconFolderDown,
    IconLink,
    IconLinkedin,
    IconPinterest,
    IconReddit,
    IconTelegram,
    IconText,
    IconTwitter,
    IconWhatsApp,
} from '@/icons';
import { type SharingOptions, SocialNetwork, type StoryActions } from 'theme-settings';

import styles from './Share.module.scss';

interface Props {
    actions?: StoryActions;
    sharingOptions: SharingOptions;
    thumbnailUrl?: string;
    url: string;
}

export function Share({ actions, thumbnailUrl, sharingOptions, url }: Props) {
    const socialNetworks = sharingOptions.sharing_actions;
    const socialShareButtonsCount = socialNetworks.length;
    const actionsButtonsCount = [
        actions?.show_copy_content,
        actions?.show_copy_url,
        actions?.show_download_assets,
        actions?.show_download_pdf,
    ].filter(Boolean).length;

    function handleCopyLink() {
        window.navigator.clipboard.writeText(url);
    }

    async function handleCopyText() {
        const { copyStoryText } = await import('./utils/copyStoryText');
        copyStoryText();
    }

    return (
        <>
            <Divider />
            <div>
                <h2>Share</h2>

                <div
                    className={classNames(styles.sharingOptions, {
                        [styles.inline]: socialShareButtonsCount === 1 && actionsButtonsCount === 1,
                    })}
                >
                    <div
                        className={classNames(styles.social, {
                            [styles.withLabels]: socialShareButtonsCount <= 2,
                        })}
                    >
                        {socialNetworks.includes(SocialNetwork.LINKEDIN) && (
                            <LinkedinShareButton
                                data-title="Share on Linkedin"
                                className={styles.socialButton}
                                url={url}
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
                                url={url}
                            >
                                <IconPinterest className={styles.socialIcon} />
                            </PinterestShareButton>
                        )}

                        {socialNetworks.includes(SocialNetwork.REDDIT) && (
                            <RedditShareButton
                                data-title="Share on Reddit"
                                className={styles.socialButton}
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
                                url={url}
                            >
                                <IconWhatsApp className={styles.socialIcon} />
                            </WhatsappShareButton>
                        )}

                        {socialNetworks.includes(SocialNetwork.TELEGRAM) && (
                            <TelegramShareButton
                                data-title="Share on Telegram"
                                className={styles.socialButton}
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

                    {actions && (
                        <div className={styles.actions}>
                            {actions.show_copy_url && (
                                <Button
                                    className={styles.action}
                                    icon={IconLink}
                                    variation="secondary"
                                    onClick={handleCopyLink}
                                >
                                    Copy link
                                </Button>
                            )}

                            {actions.show_copy_content && (
                                <Button
                                    className={styles.action}
                                    icon={IconText}
                                    variation="secondary"
                                    onClick={handleCopyText}
                                >
                                    Copy story text
                                </Button>
                            )}

                            {actions.show_download_assets && (
                                <Button
                                    className={styles.action}
                                    icon={IconFolderDown}
                                    variation="secondary"
                                >
                                    Download assets
                                </Button>
                            )}

                            {actions.show_download_pdf && (
                                <Button
                                    className={styles.action}
                                    icon={IconFileDown}
                                    variation="secondary"
                                >
                                    Download PDF
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
