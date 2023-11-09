import { translations } from '@prezly/theme-kit-intl';
import { useMemo } from 'react';

import { HighlightedStoryCard, StoryCard } from '@/components/StoryCards';
import { FormattedMessage } from '@/theme-kit/intl/client';
import type { StoryWithImage } from 'types';

import { useStoryCardLayout } from './lib';

import Illustration from '@/public/images/no-stories-illustration.svg';

import styles from './StoriesList.module.scss';

type Props = {
    newsoomName: string;
    stories: StoryWithImage[];
    isCategoryList?: boolean;
    showDates: boolean;
    showSubtitles: boolean;
};

export function StoriesList({
    newsoomName,
    stories,
    isCategoryList = false,
    showDates,
    showSubtitles,
}: Props) {
    const [highlightedStories, restStories] = useMemo(() => {
        if (isCategoryList) {
            return [[], stories];
        }
        // When there are only two stories, they should be both displayed as highlighted
        if (stories.length === 2) {
            return [stories, []];
        }

        return [stories.slice(0, 1), stories.slice(1)];
    }, [isCategoryList, stories]);

    const getStoryCardSize = useStoryCardLayout(isCategoryList, restStories.length);

    if (!highlightedStories.length && !restStories.length) {
        return (
            <div className={styles.noStories}>
                <Illustration />
                <h1 className={styles.noStoriesTitle}>
                    <FormattedMessage
                        for={translations.noStories.title}
                        values={{ newsroom: newsoomName }}
                    />
                </h1>
                <p className={styles.noStoriesSubtitle}>
                    <FormattedMessage for={translations.noStories.subtitle} />
                </p>
            </div>
        );
    }

    return (
        <>
            {highlightedStories.length > 0 && (
                <div className={styles.highlightedStoriesContainer}>
                    {highlightedStories.map((story) => (
                        <HighlightedStoryCard key={story.uuid} story={story} showDate={showDates} />
                    ))}
                </div>
            )}
            {restStories.length > 0 && (
                <div className={styles.storiesContainer}>
                    {restStories.map((story, index) => (
                        <StoryCard
                            key={story.uuid}
                            story={story}
                            size={getStoryCardSize(index)}
                            showDate={showDates}
                            showSubtitle={showSubtitles}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
