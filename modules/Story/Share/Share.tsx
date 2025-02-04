'use client';

import { useAnalytics } from '@prezly/analytics-nextjs';
import type { Story } from '@prezly/sdk';
import { translations, useIntl } from '@prezly/theme-kit-nextjs/index';
import classNames from 'classnames';

import { Button, ButtonLink } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { SocialShare } from '@/components/SocialShare';
import { IconFileDown, IconFolderDown, IconLink, IconText } from '@/icons';
import type { StoryActions } from 'theme-settings';

import type { SharingOptions } from '../type';

import { ButtonWithSuccessTooltip } from './ButtonWithSuccessTooltip';
import { getAssetsArchiveDownloadUrl } from './utils/getAssetsArchiveDownloadUrl';
import { getStoryPdfUrl } from './utils/getStoryPdfUrl';

import styles from './Share.module.scss';

interface Props {
    actions?: StoryActions;
    sharingOptions: SharingOptions;
    thumbnailUrl?: string;
    title: string;
    url: string;
    uploadcareAssetsGroupUuid: Story.ExtraFields['uploadcare_assets_group_uuid'];
    slug: Story['slug'];
    uuid: Story['uuid'];
}

export function Share({
    actions,
    uploadcareAssetsGroupUuid,
    sharingOptions,
    slug,
    title,
    thumbnailUrl,
    url,
    uuid,
}: Props) {
    const { track } = useAnalytics();
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
        track(`Newsroom - Story Page - Story link copy`, { id: uuid });
        window.navigator.clipboard.writeText(url);
    }

    async function handleCopyText() {
        track(`Newsroom - Story Page - Story text copy`, { id: uuid });
        const { copyStoryText } = await import('./utils/copyStoryText');
        copyStoryText();
    }

    async function handlePdfDownload() {
        track(`Newsroom - Story Page - Story PDF download`, { id: uuid });
        const pdfUrl = await getStoryPdfUrl(uuid);
        const link = document.createElement('a');
        link.setAttribute('href', pdfUrl);
        link.setAttribute('download', `${title}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        uuid={uuid}
                        thumbnailUrl={thumbnailUrl}
                        trackingContext="Story Page Footer"
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
                                    onClick={() => {
                                        track(`Newsroom - Story Page - Story assets download`, {
                                            id: uuid,
                                        });
                                    }}
                                >
                                    Download assets
                                </ButtonLink>
                            )}

                            {actions.show_download_pdf && (
                                <Button
                                    className={styles.action}
                                    icon={IconFileDown}
                                    variation="secondary"
                                    onClick={handlePdfDownload}
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
