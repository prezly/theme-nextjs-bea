import { FunctionComponent, useMemo } from 'react';

import { HighlightedStoryCard, StoryCard } from '@/components/StoryCards';
import { useNewsroom } from '@/hooks/useNewsroom';

import type { StoryWithImage } from './lib/types';

import Illustration from '@/public/images/no-stories-illustration.svg';

import styles from './StoriesList.module.scss';

type Props = {
    stories: StoryWithImage[];
    isCategoryList?: boolean;
};

const StoriesList: FunctionComponent<Props> = ({ stories, isCategoryList }) => {
    const newsroom = useNewsroom();

    const [highlightedStories, restStories] = useMemo(() => {
        if (isCategoryList) {
            return [[], stories];
        }
        // When there are only two stories, they should be both displayed as highlighted
        if (stories.length === 2) {
            return [stories, []];
        }

        return [stories.slice(0, 1), stories.slice(1)];
    }, [stories, isCategoryList]);

    const getStoryCardSize = (index: number): 'small' | 'medium' | 'big' => {
        if (isCategoryList) {
            return 'small';
        }

        if (restStories.length === 3 || restStories.length === 6) {
            return 'medium';
        }

        if (index < 2 || restStories.length === 4) {
            return 'big';
        }

        if (index < 5) {
            return 'medium';
        }

        return 'small';
    };

    if (!highlightedStories.length && !restStories.length) {
        return (
            <div className={styles.noStories}>
                <Illustration />
                <h1 className={styles.noStoriesTitle}>
                    {newsroom?.display_name} hasn’t added any stories yet!
                </h1>
                <p className={styles.noStoriesSubtitle}>Come back later to see what’s cooking.</p>
            </div>
        );
    }

    return (
        <>
            {highlightedStories.length > 0 && (
                <div className={styles.highlightedStoriesContainer}>
                    {highlightedStories.map((story) => (
                        <HighlightedStoryCard key={story.uuid} story={story} />
                    ))}
                </div>
            )}
            {restStories.length > 0 && (
                <div className={styles.storiesContainer}>
                    {restStories.map((story, index) => (
                        <StoryCard key={story.uuid} story={story} size={getStoryCardSize(index)} />
                    ))}
                </div>
            )}
        </>
    );
};

export default StoriesList;
