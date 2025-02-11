'use client';

import type { Story } from '@prezly/sdk';
import { translations, useIntl } from '@prezly/theme-kit-nextjs/index';
import classNames from 'classnames';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { SocialShare } from '@/components/SocialShare';
import { IconFileDown, IconFolderDown, IconLink, IconText } from '@/icons';
import type { SocialNetwork, StoryActions } from 'theme-settings';

import { ButtonWithSuccessTooltip } from './ButtonWithSuccessTooltip';
import { copyStoryText } from './utils/copyStoryText';
import { getAssetsArchiveDownloadUrl } from './utils/getAssetsArchiveDownloadUrl';
import { getStoryPdfUrl } from './utils/getStoryPdfUrl';

import styles from './Share.module.scss';

interface Props {
    actions?: StoryActions;
    socialNetworks: SocialNetwork[];
    thumbnailUrl?: string;
    title: string;
    url: string | null;
    uploadcareAssetsGroupUuid: Story['uploadcare_assets_group_uuid'];
    slug: Story['slug'];
    uuid: Story['uuid'];
}

export function Share({
    actions,
    uploadcareAssetsGroupUuid,
    socialNetworks,
    slug,
    title,
    thumbnailUrl,
    url,
    uuid,
}: Props) {
    const { formatMessage } = useIntl();
    const [isPdfLinkBeingGenerated, setIsPdfLinkBeingGenerated] = useState(false);
    const socialShareButtonsCount = socialNetworks.length;
    const actionsButtonsCount = [
        actions?.show_copy_content,
        Boolean(url) && actions?.show_copy_url,
        actions?.show_download_assets,
        actions?.show_download_pdf,
    ].filter(Boolean).length;

    if (socialShareButtonsCount === 0 && actionsButtonsCount === 0) {
        return null;
    }

    const assetsUrl = uploadcareAssetsGroupUuid
        ? getAssetsArchiveDownloadUrl(uploadcareAssetsGroupUuid, slug)
        : undefined;

    function handleCopyLink() {
        window.navigator.clipboard.writeText(url!);
    }

    function handleCopyText() {
        copyStoryText();
    }

    async function handlePdfDownload() {
        try {
            setIsPdfLinkBeingGenerated(true);
            const pdfUrl = await getStoryPdfUrl(uuid);

            if (!pdfUrl) {
                return;
            }

            const link = document.createElement('a');
            link.setAttribute('href', pdfUrl);
            link.setAttribute('download', `${title}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsPdfLinkBeingGenerated(false);
        }
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
                        title={title}
                        withLabels={socialShareButtonsCount <= 2}
                    />

                    {actions && (
                        <div className={styles.actions}>
                            {url && actions.show_copy_url && (
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
                                    loading={isPdfLinkBeingGenerated}
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
