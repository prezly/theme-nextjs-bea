import { useCompanyInformation, useNewsroom } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

import { StoryCard } from '@/components';
import type { StoryWithImage } from 'types';

import { useStoryCardLayout } from './lib';

import Illustration from '@/public/images/no-stories-illustration.svg';

import styles from './StoriesList.module.scss';

type Props = {
    stories: StoryWithImage[];
    isCategoryList?: boolean;
};

function StoriesList({ stories, isCategoryList = false }: Props) {
    const { name } = useCompanyInformation();
    const { display_name } = useNewsroom();

    const getStoryCardSize = useStoryCardLayout(isCategoryList, stories.length);

    if (!stories.length) {
        return (
            <div className={styles.noStories}>
                <Illustration />
                <h1 className={styles.noStoriesTitle}>
                    <FormattedMessage
                        {...translations.noStories.title}
                        values={{ newsroom: name || display_name }}
                    />
                </h1>
                <p className={styles.noStoriesSubtitle}>
                    <FormattedMessage {...translations.noStories.subtitle} />
                </p>
            </div>
        );
    }

    return (
        <div className={styles.storiesContainer}>
            {stories.map((story, index) => (
                <StoryCard key={story.uuid} story={story} size={getStoryCardSize(index)} />
            ))}
        </div>
    );
}

export default StoriesList;
