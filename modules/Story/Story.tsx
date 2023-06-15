import { useAnalyticsContext } from '@prezly/analytics-nextjs';
import type { ExtendedStory } from '@prezly/sdk';
import { isEmbargoStory } from '@prezly/theme-kit-core';
import { StorySeo } from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';

import { StoryPublicationDate } from '@/components';
import { useThemeSettings } from '@/hooks';

import Layout from '../Layout';

import { HeaderRenderer } from './HeaderRenderer';

import styles from './Story.module.scss';

const CategoriesList = dynamic(() => import('@/components/CategoriesList'));
const ContentRenderer = dynamic(() => import('@/components/ContentRenderer'));
const StoryLinks = dynamic(() => import('@/components/StoryLinks'));
const Embargo = dynamic(() => import('./Embargo'));

type Props = {
    story: ExtendedStory;
};

function Story({ story }: Props) {
    const { showDate } = useThemeSettings();
    const { isEnabled: isAnalyticsEnabled } = useAnalyticsContext();

    if (!story) {
        return null;
    }

    const { categories, links } = story;
    const hasCategories = categories.length > 0;
    const nodes = JSON.parse(story.content);

    return (
        <Layout>
            <StorySeo story={story} noindex={!isAnalyticsEnabled} />
            <article className={styles.story}>
                <div className={styles.container}>
                    {isEmbargoStory(story) && <Embargo story={story} />}
                    {hasCategories && <CategoriesList categories={categories} showAllCategories />}
                    <HeaderRenderer nodes={nodes} />
                    {showDate && (
                        <p className={styles.date}>
                            <StoryPublicationDate story={story} />
                        </p>
                    )}
                    <StoryLinks url={links.short || links.newsroom_view} />
                    <ContentRenderer nodes={nodes} />
                </div>
            </article>
        </Layout>
    );
}

export default Story;
