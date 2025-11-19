'use client';

import type { Newsroom } from '@prezly/sdk';
import classNames from 'classnames';

import { IconPrezly, IconSettings } from '@/icons';
import { PREVIEW } from '@/events';
import { analytics, isPreviewActive } from '@/utils';

import styles from './PreviewBar.module.scss';
import { usePreviewContext } from '../Broadcast';

interface Props {
    newsroom: Newsroom;
}

export function PreviewBar({ newsroom }: Props) {
    const { isSecretStoryPage } = usePreviewContext();
    const isPreview = isPreviewActive();

    if (!isPreview) {
        return null;
    }

    const siteSettingsUrl = `https://rock.prezly.com/sites/${newsroom.uuid}/settings/information`;

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
            <a
                className={styles.siteSettings}
                href={siteSettingsUrl}
                onClick={() => analytics.track(PREVIEW.SITE_SETTINGS_CLICKED)}
                rel="noopener noreferrer"
                target="_blank"
            >
                <IconSettings className={styles.settingsIcon} /> Site settings
            </a>
        </div>
    );
}
