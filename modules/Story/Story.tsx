import type { ExtendedStory, Story as StoryType } from '@prezly/sdk';
import { StoryFormatVersion } from '@prezly/sdk';
import { StorySeo } from '@prezly/theme-kit-nextjs';
import { StoryPublicationDate } from '@prezly/themes-ui-components';
import Image from '@prezly/uploadcare-image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Container } from '@/components/TailwindSpotlight/Container';
import { useThemeSettings } from '@/hooks';
import { getStoryImageSizes } from '@/utils';
import { formatDate } from '@/utils/formatDate';

import Layout from '../Layout';

import { RelatedStories } from './RelatedStories';

import styles from './Story.module.scss';

const CategoriesList = dynamic(() => import('@/components/CategoriesList'));
const SlateRenderer = dynamic(() => import('@/components/SlateRenderer'));
const StoryLinks = dynamic(() => import('@/components/StoryLinks'));

type Props = {
    story: ExtendedStory;
    relatedStories?: StoryType[] | null;
};

interface IconTypeProps {
    className: string;
}

function ArrowLeftIcon({ className }: IconTypeProps) {
    return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
            <path
                d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Story({ story, relatedStories }: Props) {
    const { showDate } = useThemeSettings();
    const router = useRouter();

    if (!story) {
        return null;
    }

    const { title, subtitle, content, format_version, categories, links } = story;
    const headerImage = story.header_image ? JSON.parse(story.header_image) : null;
    const hasCategories = categories.length > 0;
    const previousPathname = '123';

    return (
        <Layout>
            <StorySeo story={story} />
            <Container className="mt-16 lg:mt-32">
                <div className="xl:relative">
                    <div className="mx-auto max-w-2xl">
                        {previousPathname && (
                            <button
                                type="button"
                                onClick={() => router.back()}
                                aria-label="Go back to articles"
                                className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:mb-0 lg:-mt-2 xl:-top-1.5 xl:left-0 xl:mt-0"
                            >
                                <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
                            </button>
                        )}
                        <article>
                            <header className="flex flex-col">
                                <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                                    {title}
                                </h1>
                                <time
                                    dateTime={story.published_at ?? ''}
                                    className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
                                >
                                    <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                                    <span className="ml-3">
                                        {formatDate(story.published_at ?? '')}
                                    </span>
                                </time>
                            </header>
                            <article className="prose lg:prose-xl dark:prose-invert">
                                {format_version === StoryFormatVersion.HTML && (
                                    // eslint-disable-next-line react/no-danger
                                    <div dangerouslySetInnerHTML={{ __html: content }} />
                                )}
                                {format_version === StoryFormatVersion.SLATEJS && (
                                    <SlateRenderer nodes={JSON.parse(content as string)} />
                                )}
                            </article>
                        </article>
                    </div>
                </div>
            </Container>
        </Layout>
    );

    return (
        <Layout>
            <StorySeo story={story} />
            <article className={styles.story}>
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
            </article>
        </Layout>
    );
}

export default Story;
