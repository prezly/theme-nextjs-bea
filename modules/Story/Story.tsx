import { useAnalyticsContext } from '@prezly/analytics-nextjs';
import type { ExtendedStory } from '@prezly/sdk';
import { Story as StorySdk } from '@prezly/sdk';
import { isEmbargoStory, StorySeo } from '@prezly/theme-kit-nextjs';
import { StoryPublicationDate } from '@prezly/themes-ui-components';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { useThemeSettings } from '@/hooks';
import { getStoryImageSizes } from '@/utils';

import Layout from '../Layout';

import styles from './Story.module.scss';

const CategoriesList = dynamic(() => import('@/components/CategoriesList'));
const SlateRenderer = dynamic(() => import('@/components/SlateRenderer'));
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

    const { title, subtitle, content, format_version, categories, links } = story;
    const headerImage = story.header_image ? JSON.parse(story.header_image) : null;
    const hasHeaderImage = Boolean(headerImage);
    const hasCategories = categories.length > 0;

    return (
        <Layout>
            <StorySeo story={story} noindex={!isAnalyticsEnabled} />
            <article className={styles.story}>
                <div
                    className={classNames(styles.container, {
                        [styles.withImage]: hasHeaderImage,
                    })}
                >
                    {hasCategories && <CategoriesList categories={categories} showAllCategories />}
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
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
                    {format_version === StorySdk.FormatVersion.HTML && (
                        // eslint-disable-next-line react/no-danger
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                    {format_version === StorySdk.FormatVersion.SLATEJS && (
                        <SlateRenderer nodes={JSON.parse(content as string)} />
                    )}
                </div>
            </article>
        </Layout>
    );
}

export default Story;
