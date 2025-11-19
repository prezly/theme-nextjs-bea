'use client';

import type { Newsroom } from '@prezly/sdk';
import classNames from 'classnames';

import { IconPrezly, IconSettings, IconSquarePen } from '@/icons';
import { PREVIEW } from '@/events';
import { analytics, clearPreview, isPreviewActive } from '@/utils';

import styles from './PreviewBar.module.scss';
import { useBroadcastedStory, usePreviewContext } from '../Broadcast';

interface Props {
    newsroom: Newsroom;
}

export function PreviewBar({ newsroom }: Props) {
    const { isSecretStoryPage } = usePreviewContext();
    const broadcastedStory = useBroadcastedStory();

    const isPreview = isPreviewActive();

    if (!isPreview) {
        return null;
    }

    const siteSettingsUrl = `https://rock.prezly.com/sites/${newsroom.uuid}/settings/information`;
    const storyEditUrl = broadcastedStory
        ? `https://rock.prezly.com/stories/${broadcastedStory.id}`
        : undefined;

    function handleClearPreview() {
        analytics.track(PREVIEW.SITE_SETTINGS_CLICKED);
        clearPreview();
    }

    return (
        <div className={classNames(styles.wrapper, { [styles.noDescription]: !isSecretStoryPage })}>
            <a
                className={styles.appLink}
                href="https://rock.prezly.com"
                onClick={() => analytics.track(PREVIEW.LOGO_CLICKED)}
                rel="noopener noreferrer"
                target="_blank"
            >
                <IconPrezly />
            </a>
            {isSecretStoryPage && (
                <p className={styles.description}>
                    This is a preview with a temporary URL which will change after publishing.
                </p>
            )}
            <div className={styles.actions}>
                <a
                    className={styles.action}
                    href={siteSettingsUrl}
                    onClick={() => analytics.track(PREVIEW.SITE_SETTINGS_CLICKED)}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <IconSettings className={styles.icon} /> Site settings
                </a>
                {broadcastedStory && (
                    <a
                        className={styles.action}
                        href={storyEditUrl}
                        onClick={() => analytics.track(PREVIEW.SITE_SETTINGS_CLICKED)}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <IconSquarePen className={styles.icon} /> Edit story
                    </a>
                )}
                {!isSecretStoryPage && (
                    <button
                        className={classNames(styles.action, styles.closeButton)}
                        onClick={handleClearPreview}
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
