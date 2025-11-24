'use client';

import { Elements } from '@prezly/content-renderer-react-js';
import type { Newsroom, Story } from '@prezly/sdk';
import { translations, useIntl } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { Divider } from '@/components/Divider';
import { isPreviewActive } from '@/utils';

import { LatestStoryPlaceholder } from './LatestStoryPlaceholder';
import styles from './RelatedStories.module.scss';

interface Props {
    hasRelatedStories?: boolean;
    newsroom: Newsroom;
    stories: Story[];
}

export function RelatedStories({ hasRelatedStories = false, newsroom, stories }: Props) {
    const { formatMessage } = useIntl();
    const isPreview = isPreviewActive();

    if (!hasRelatedStories) {
        return null;
    }

    if (!isPreview && stories.length === 0) {
        return null;
    }

    return (
        <>
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
                        storyOEmbedInfo={story.oembed}
                    />
                ))}
            </div>
        </>
    );
}
