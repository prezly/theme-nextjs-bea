import type { ExtendedStory } from '@prezly/sdk';
import { Alignment } from '@prezly/story-content-format';
import { isEmbargoStory } from '@prezly/theme-kit-core';
import { StorySeo } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { StoryPublicationDate } from '@/components';
import { useThemeSettings } from '@/hooks';
import { getHeaderAlignment } from '@/utils';

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

const noIndex = process.env.VERCEL === '1';

function Story({ story }: Props) {
    const { showDate } = useThemeSettings();

    if (!story) {
        return null;
    }

    const { categories, links } = story;
    const hasCategories = categories.length > 0;
    const nodes = JSON.parse(story.content);

    const headerAlignment = getHeaderAlignment(nodes);

    return (
        <Layout>
            <StorySeo story={story} noindex={noIndex} />
            <article className={styles.story}>
                <div className={styles.container}>
                    {isEmbargoStory(story) && <Embargo story={story} />}
                    {hasCategories && <CategoriesList categories={categories} showAllCategories />}
                    <HeaderRenderer nodes={nodes} />
                    <div
                        className={classNames(styles.linksAndDateWrapper, {
                            [styles.left]: headerAlignment === Alignment.LEFT,
                            [styles.right]: headerAlignment === Alignment.RIGHT,
                            [styles.center]: headerAlignment === Alignment.CENTER,
                        })}
                    >
                        {showDate && (
                            <p className={styles.date}>
                                <StoryPublicationDate story={story} />
                            </p>
                        )}
                        <StoryLinks url={links.short || links.newsroom_view} />
                    </div>
                    <ContentRenderer nodes={nodes} />
                </div>
            </article>
        </Layout>
    );
}

export default Story;
