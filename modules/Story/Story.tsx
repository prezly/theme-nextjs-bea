import type { ExtendedStory } from '@prezly/sdk';
import { StoryFormatVersion } from '@prezly/sdk';
import { isEmbargoStory, StorySeo } from '@prezly/theme-kit-nextjs';
import { StoryPublicationDate } from '@prezly/themes-ui-components';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { StoryStickyBar } from '@/components';
import { useThemeSettings } from '@/hooks';

import Layout from '../Layout';

import styles from './Story.module.scss';

const CategoriesList = dynamic(() => import('@/components/CategoriesList'));
const SlateRenderer = dynamic(() => import('@/components/SlateRenderer'));
const Embargo = dynamic(() => import('./Embargo'));

type Props = {
    story: ExtendedStory;
};

// TODO: This will become a theme setting
const IS_FANCY_IMAGE_ENABLED = false;

function Story({ story }: Props) {
    const { showDate } = useThemeSettings();

    if (!story) {
        return null;
    }

    const { title, subtitle, content, format_version, categories } = story;
    const headerImage = story.header_image ? JSON.parse(story.header_image) : null;
    const hasHeaderImage = Boolean(headerImage);
    const hasCategories = categories.length > 0;

    return (
        <Layout>
            <StorySeo story={story} />
            <article className={styles.story}>
                {headerImage && (
                    <Image
                        alt=""
                        className={classNames({
                            [styles.mainImage]: !IS_FANCY_IMAGE_ENABLED,
                            [styles.fullWidthImage]: IS_FANCY_IMAGE_ENABLED,
                        })}
                        objectFit="cover"
                        layout="fill"
                        imageDetails={headerImage}
                    />
                )}
                <div
                    className={classNames(styles.container, {
                        [styles.withImage]: hasHeaderImage && !IS_FANCY_IMAGE_ENABLED,
                        [styles.withFullWidthImage]: hasHeaderImage && IS_FANCY_IMAGE_ENABLED,
                    })}
                >
                    <StoryStickyBar story={story} />
                    {isEmbargoStory(story) && <Embargo story={story} />}
                    <div className={styles.meta}>
                        {showDate && <StoryPublicationDate story={story} />}
                        {showDate && hasCategories && <> &middot; </>}
                        {hasCategories && (
                            <CategoriesList categories={categories} showAllCategories />
                        )}
                    </div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                    {format_version === StoryFormatVersion.HTML && (
                        // eslint-disable-next-line react/no-danger
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                    {format_version === StoryFormatVersion.SLATEJS && (
                        <SlateRenderer nodes={JSON.parse(content as string)} />
                    )}
                </div>
            </article>
        </Layout>
    );
}

export default Story;
