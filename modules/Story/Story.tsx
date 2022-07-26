import type { ExtendedStory, Story as StoryType } from '@prezly/sdk';
import { StoryFormatVersion } from '@prezly/sdk';
import { isEmbargoStory, StorySeo } from '@prezly/theme-kit-nextjs';
import { StoryPublicationDate } from '@prezly/themes-ui-components';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { useThemeSettings } from '@/hooks';
import { getStoryImageSizes } from '@/utils';

import Layout from '../Layout';

import { RelatedStories } from './RelatedStories';

import styles from './Story.module.scss';

const CategoriesList = dynamic(() => import('@/components/CategoriesList'));
const SlateRenderer = dynamic(() => import('@/components/SlateRenderer'));
const StoryLinks = dynamic(() => import('@/components/StoryLinks'));
const Embargo = dynamic(() => import('./Embargo'));

type Props = {
    story: ExtendedStory;
    relatedStories?: StoryType[] | null;
};

function Story({ story, relatedStories }: Props) {
    const { showDate } = useThemeSettings();

    if (!story) {
        return null;
    }

    const { title, subtitle, content, format_version, categories, links } = story;
    const headerImage = story.header_image ? JSON.parse(story.header_image) : null;
    const hasHeaderImage = Boolean(headerImage);
    const hasCategories = categories.length > 0;

    return (
        <Layout>
            <StorySeo story={story} />
            <article className={styles.story}>
                <div
                    className={classNames('bg-white mx-auto dark:bg-gray-800', styles.container, {
                        [styles.withImage]: hasHeaderImage,
                    })}
                >
                    {hasCategories && <CategoriesList categories={categories} showAllCategories />}
                    <h1 className="mt-2 mb-4 text-4xl font-bold">{title}</h1>
                    {subtitle && (
                        <h2 className="mt-3 text-xl font-medium text-slate-700 dark:text-slate-50 mb-4">
                            {subtitle}
                        </h2>
                    )}
                    {showDate && (
                        <p className={styles.date}>
                            <StoryPublicationDate story={story} />
                        </p>
                    )}
                    <StoryLinks url={links.short || links.newsroom_view} />
                    {headerImage && (
                        <Image
                            alt=""
                            className={styles.mainImage}
                            objectFit="cover"
                            layout="fill"
                            imageDetails={headerImage}
                            sizes={getStoryImageSizes()}
                        />
                    )}
                    {isEmbargoStory(story) && <Embargo story={story} />}
                    <article className="prose lg:prose-xl dark:prose-invert">
                        {format_version === StoryFormatVersion.HTML && (
                            // eslint-disable-next-line react/no-danger
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        )}
                        {format_version === StoryFormatVersion.SLATEJS && (
                            <SlateRenderer nodes={JSON.parse(content as string)} />
                        )}
                    </article>

                    <RelatedStories stories={relatedStories} />
                </div>
            </article>
        </Layout>
    );
}

export default Story;
