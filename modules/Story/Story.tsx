import { StoryFormatVersion } from '@prezly/sdk';
import type { ExtendedStory } from '@prezly/sdk/dist/types';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { StorySeo } from '@/components/seo';
import StoryStickyBar from '@/components/StoryStickyBar';
import { getStoryPublicationDate } from '@/utils/prezly';

import Layout from '../Layout';

import { isEmbargoStory } from './lib';

import styles from './Story.module.scss';

const CategoriesList = dynamic(() => import('@/components/CategoriesList'));
const SlateRenderer = dynamic(() => import('@/components/SlateRenderer'));
const Embargo = dynamic(() => import('./Embargo'));

type Props = {
    story: ExtendedStory;
};

const Story: FunctionComponent<Props> = ({ story }) => {
    if (!story) {
        return null;
    }

    const { title, subtitle, content, format_version } = story;
    const headerImage = story.header_image ? JSON.parse(story.header_image) : null;
    const hasHeaderImage = Boolean(headerImage);

    return (
        <Layout>
            <StorySeo story={story} />
            <article className={styles.story}>
                {headerImage && (
                    <Image
                        alt=""
                        className={styles.mainImage}
                        objectFit="cover"
                        layout="fill"
                        imageDetails={headerImage}
                    />
                )}
                <div
                    className={classNames(styles.container, {
                        [styles.withImage]: hasHeaderImage,
                    })}
                >
                    {isEmbargoStory(story) && <Embargo story={story} />}
                    <div className={styles.meta}>
                        {getStoryPublicationDate(story)}
                        {story.categories.length > 0 && (
                            <>
                                {' '}
                                &middot;{' '}
                                <CategoriesList categories={story.categories} showAllCategories />
                            </>
                        )}
                    </div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                    <div className={styles.separator} />
                    {format_version === StoryFormatVersion.HTML && (
                        // eslint-disable-next-line react/no-danger
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                    {format_version === StoryFormatVersion.SLATEJS && (
                        <SlateRenderer nodes={JSON.parse(content as string)} />
                    )}
                </div>
            </article>
            <StoryStickyBar story={story} />
        </Layout>
    );
};

export default Story;
