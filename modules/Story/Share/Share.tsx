'use client';

import { translations, useIntl } from '@prezly/theme-kit-nextjs/index';
import classNames from 'classnames';

import { Button, ButtonLink } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { SocialShare } from '@/components/SocialShare';
import { IconFileDown, IconFolderDown, IconLink, IconText } from '@/icons';
import type { StoryActions } from 'theme-settings';

import type { SharingOptions } from '../type';

import { ButtonWithSuccessTooltip } from './ButtonWithSuccessTooltip';
import styles from './Share.module.scss';
import { getAssetsArchiveDownloadUrl } from './utils/getAssetsArchiveDownloadUrl';

interface Props {
    actions?: StoryActions;
    sharingOptions: SharingOptions;
    thumbnailUrl?: string;
    url: string;
    uploadcareAssetsGroupUuid: string | null;
    slug: string;
}

export function Share({
    actions,
    uploadcareAssetsGroupUuid,
    thumbnailUrl,
    sharingOptions,
    url,
    slug,
}: Props) {
    const { formatMessage } = useIntl();
    const socialNetworks = sharingOptions.sharing_actions;
    const socialShareButtonsCount = socialNetworks.length;
    const actionsButtonsCount = [
        actions?.show_copy_content,
        actions?.show_copy_url,
        actions?.show_download_assets,
        actions?.show_download_pdf,
    ].filter(Boolean).length;
    const assetsUrl = uploadcareAssetsGroupUuid
        ? getAssetsArchiveDownloadUrl(uploadcareAssetsGroupUuid, slug)
        : undefined;

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
                                <ButtonWithSuccessTooltip
                                    className={styles.action}
                                    icon={IconLink}
                                    variation="secondary"
                                    successMessage={formatMessage(translations.misc.shareUrlCopied)}
                                    onClick={handleCopyLink}
                                >
                                    Copy link
                                </ButtonWithSuccessTooltip>
                            )}

                            {actions.show_copy_content && (
                                <ButtonWithSuccessTooltip
                                    className={styles.action}
                                    icon={IconText}
                                    variation="secondary"
                                    successMessage="Copied to clipboard"
                                    onClick={handleCopyText}
                                >
                                    Copy story text
                                </ButtonWithSuccessTooltip>
                            )}

                            {actions.show_download_assets && assetsUrl && (
                                <ButtonLink
                                    href={assetsUrl}
                                    className={styles.action}
                                    icon={IconFolderDown}
                                    variation="secondary"
                                >
                                    Download assets
                                </ButtonLink>
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
