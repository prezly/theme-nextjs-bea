"use client";

import type { Newsroom } from "@prezly/sdk";

import { IconPrezly, IconSettings } from "@/icons";

import styles from "./PreviewBar.module.scss";
import { usePreviewContext } from "../Broadcast";

interface Props {
    newsroom: Newsroom;
}

export function PreviewBar({ newsroom }: Props) {
    const { isPreview } = usePreviewContext();

    if (!isPreview) {
        return null;
    }

    const siteSettingsUrl = `http://rock.prezly.test/sites/${newsroom.uuid}/settings/information`;

    return (
        <div className={styles.wrapper}>
            <a
                className={styles.appLink}
                href="https://rock.prezly.com"
                rel="noopener noreferrer"
                target="_blank"
            >
                <IconPrezly />
            </a>
            <p className={styles.description}>
                This is a preview with a temporary URL which will change after publishing.
            </p>
            <a
                className={styles.siteSettings}
                href={siteSettingsUrl}
                rel="noopener noreferrer"
                target="_blank"
            >
                <IconSettings className={styles.settingsIcon} /> Site settings
            </a>
        </div>
    );
}
