'use client';

import { ACTIONS, DOWNLOAD } from '@prezly/analytics-nextjs';
import type { ExtendedStory, Story } from '@prezly/sdk';
import { translations, useIntl } from '@prezly/theme-kit-nextjs/index';
import classNames from 'classnames';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { SocialShare } from '@/components/SocialShare';
import { IconFileDown, IconFolderDown, IconLink, IconText } from '@/icons';
import type { SocialNetwork, StoryActions } from '@/theme-settings';
import { analytics, isPreviewActive } from '@/utils';

import { ButtonWithSuccessTooltip } from './ButtonWithSuccessTooltip';
import { copyStoryText } from './utils/copyStoryText';
import { getAssetsArchiveDownloadUrl } from './utils/getAssetsArchiveDownloadUrl';
import { getStoryPdfUrl } from './utils/getStoryPdfUrl';

import styles from './Share.module.scss';
import { SharePlaceholder } from './SharePlaceholder';

interface Props {
    actions: StoryActions;
    socialNetworks: SocialNetwork[];
    thumbnailUrl?: string;
    text: ExtendedStory['social_text'];
    title: Story['title'];
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
    text,
    title,
    thumbnailUrl,
    url,
    uuid,
}: Props) {
    const { formatMessage } = useIntl();
    const [isPdfLinkBeingGenerated, setIsPdfLinkBeingGenerated] = useState(false);
    const assetsUrl = uploadcareAssetsGroupUuid
        ? getAssetsArchiveDownloadUrl(uploadcareAssetsGroupUuid, slug)
        : undefined;
    const socialShareButtonsCount = socialNetworks.length;
    const actionsButtonsCount = [
        actions.show_copy_content,
        actions.show_copy_url && Boolean(url),
        actions.show_download_assets && Boolean(assetsUrl),
        actions.show_download_pdf,
    ].filter(Boolean).length;
    const isPreview = isPreviewActive();

    if (isPreview && !url) {
        return <SharePlaceholder actions={actions} socialNetworks={socialNetworks} />;
    }

    if ((socialShareButtonsCount === 0 || !url) && actionsButtonsCount === 0) {
        return null;
    }

    function handleCopyLink() {
        analytics.track(ACTIONS.COPY_STORY_LINK, { id: uuid });
        window.navigator.clipboard.writeText(url!);
    }

    function handleCopyText() {
        analytics.track(ACTIONS.COPY_STORY_TEXT, { id: uuid });
        copyStoryText();
    }

    async function handlePdfDownload() {
        analytics.track(DOWNLOAD.STORY_PDF, { id: uuid });
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
                <h2>{trim(formatMessage(translations.actions.share))}</h2>

                <div
                    className={classNames(styles.sharingOptions, {
                        [styles.inline]: socialShareButtonsCount === 1 && actionsButtonsCount === 1,
                    })}
                >
                    <SocialShare
                        socialNetworks={socialNetworks}
                        url={url}
                        text={text}
                        thumbnailUrl={thumbnailUrl}
                        trackingContext="Story Page Footer"
                        uuid={uuid}
                        withLabels={socialShareButtonsCount <= 2}
                    />

                    {actionsButtonsCount > 0 && (
                        <div className={styles.actions}>
                            {actions.show_copy_url && url && (
                                <ButtonWithSuccessTooltip
                                    className={styles.action}
                                    icon={IconLink}
                                    variation="secondary"
                                    successMessage={formatMessage(translations.misc.shareUrlCopied)}
                                    onClick={handleCopyLink}
                                >
                                    {formatMessage(translations.actions.copyShareUrl)}
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
                                    {formatMessage(translations.actions.copyText)}
                                </ButtonWithSuccessTooltip>
                            )}

                            {actions.show_download_assets && assetsUrl && (
                                <ButtonLink
                                    href={assetsUrl}
                                    className={styles.action}
                                    icon={IconFolderDown}
                                    variation="secondary"
                                    onClick={() => {
                                        analytics.track(DOWNLOAD.STORY_ASSETS, { id: uuid });
                                    }}
                                >
                                    {formatMessage(translations.actions.downloadAssets)}
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
                                    {formatMessage(translations.actions.downloadPdf)}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function trim(text: string) {
    return text.replace(/^[\s:]+|[\s:]+$/g, '');
}
