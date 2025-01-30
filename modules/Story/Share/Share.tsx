'use client';

import classNames from 'classnames';

import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { SocialShare } from '@/components/SocialShare';
import { IconFileDown, IconFolderDown, IconLink, IconText } from '@/icons';
import type { StoryActions } from 'theme-settings';

import type { SharingOptions } from '../type';

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
                    <SocialShare
                        socialNetworks={socialNetworks}
                        url={url}
                        thumbnailUrl={thumbnailUrl}
                        withLabels={socialShareButtonsCount <= 2}
                    />

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
