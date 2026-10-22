'use client';

import { Elements } from '@prezly/content-renderer-react-js';
import type { Story } from '@prezly/sdk';
import { translations, useIntl } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { useBasePathConfig, useLocale } from '@/adapters/client';
import { Divider } from '@/components/Divider';
import { usePreviewSettings, useIsPreviewActive } from '@/hooks';
import type { PublicNewsroom, PublicStory } from '@/utils';
import { applyBasePathAbsolute, parseBoolean } from '@/utils';

import { LatestStoryPlaceholder } from './LatestStoryPlaceholder';
import styles from './RelatedStories.module.scss';

interface Props {
    hasRelatedStories?: boolean;
    newsroom: PublicNewsroom;
    stories: PublicStory<Story>[];
}

export function RelatedStories({
    hasRelatedStories: hasRelatedStoriesProp = false,
    newsroom,
    stories,
}: Props) {
    const { formatMessage } = useIntl();
    const isPreview = useIsPreviewActive();
    const previewSettings = usePreviewSettings();
    const basePathConfig = useBasePathConfig();
    // Related stories are always fetched in the current page's locale, so the
    // active locale is the right prefix for their URLs. (The sanitized public
    // story payload no longer carries `culture`.)
    const localeCode = useLocale();

    const hasRelatedStories = previewSettings
        ? parseBoolean(previewSettings.show_read_more ?? String(hasRelatedStoriesProp))
        : hasRelatedStoriesProp;

    if (!hasRelatedStories) {
        return null;
    }

    if (!isPreview && stories.length === 0) {
        return null;
    }

    return (
        // Scroll target for scrollToSelector postMessage from preview host
        <div data-preview-section="read-more">
            <Divider />
            <h2 className={classNames({ [styles.placeholder]: isPreview && stories.length === 0 })}>
                {formatMessage(translations.homepage.latestStories)}
            </h2>

            <div>
                {isPreview && stories.length === 0 && (
                    <LatestStoryPlaceholder newsroom={newsroom} />
                )}
                {stories.map((story) => (
                    <Elements.StoryBookmark
                        key={story.uuid}
                        node={{
                            story: { uuid: story.uuid },
                            show_thumbnail: true,
                            layout: 'horizontal',
                            new_tab: false,
                            type: 'story-bookmark',
                            uuid: story.uuid,
                        }}
                        storyOEmbedInfo={{
                            ...story.oembed,
                            // oembed.url is the backend-provided absolute URL; re-apply
                            // the theme's reverse-proxy prefix so the link matches the
                            // proxy (e.g. /nl_BE/news/<slug>). No-op when unconfigured.
                            url: applyBasePathAbsolute(
                                story.oembed.url,
                                basePathConfig,
                                localeCode,
                            ),
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
