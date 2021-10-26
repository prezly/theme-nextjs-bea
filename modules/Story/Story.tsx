import type { ExtendedStory } from '@prezly/sdk/dist/types';
import { FormatVersion } from '@prezly/sdk/dist/types/Story';
import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import CategoriesList from '@/components/CategoriesList';
import { StorySeo } from '@/components/seo';
import SlateRenderer from '@/components/SlateRenderer';
import StoryStickyBar from '@/components/StoryStickyBar';
import { getStoryPublicationDate } from '@/utils/prezly';

import { isEmbargoExtendedStory } from './lib';

import styles from './Story.module.scss';

const Embargo = dynamic(() => import('./Embargo'), { ssr: true });

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
        <>
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
                    {isEmbargoExtendedStory(story) && <Embargo story={story} />}
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
                    {format_version === FormatVersion.HTML && (
                        // eslint-disable-next-line react/no-danger
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                    {format_version === FormatVersion.SLATEJS && (
                        <SlateRenderer nodes={JSON.parse(content as string)} />
                    )}
                </div>
            </article>
            <StoryStickyBar story={story} />
        </>
    );
};

export default Story;
