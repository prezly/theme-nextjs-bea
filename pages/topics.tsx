import type { HomePageProps } from '@prezly/theme-kit-nextjs';
import { getHomepageStaticProps } from '@prezly/theme-kit-nextjs';
import Link from 'next/link';
import type { FunctionComponent } from 'react';

import { Card } from '@/components/TailwindSpotlight/Card';
import { Container } from '@/components/TailwindSpotlight/Container';
import Layout from '@/modules/Layout';
import { importMessages, isTrackingEnabled, loadFeaturedStories } from '@/utils';
import type { BasePageProps, StoryWithImage } from 'types';

type Props = BasePageProps & HomePageProps<StoryWithImage>;

const topics = [
    {
        name: 'Product Management',
        description: 'Anything about product prioritisation and product management',
        slug: '/category/product-management',
    },
    {
        name: 'Building an editor',
        description:
            'Research and findings on how to craft an editing/writing experience our customers love️.',
        slug: '/category/building-an-editor',
    },
    {
        name: 'Marketing Attribution',
        description:
            'A series of posts about solving marketing attribution using Segment.com and Lambda',
        slug: '/category/solving-marketing-attribution',
    },
    {
        name: 'The Best Newsroom',
        description:
            'For an upcoming Prezly project we are rethinking the newsroom part of Prezly.',
        slug: '/category/the-best-newsroom',
    },
    {
        name: 'Personal',
        description: 'Stuff about my family, hobbies and our recent move to Spain.',
        slug: '/category/lifelog',
    },
];

const AboutPage: FunctionComponent<Props> = () => (
    <Layout title="Topics I write about">
        <Container className="mt-16 sm:mt-32">
            <header className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                    Topics I&apos;m writing about
                </h1>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                    The blog is all over the place. I mainly post to shape my thoughts (writing =
                    thinking). That&apos;s why you will find content about tech stuff, experiments,
                    thoughts about running a business.
                </p>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                    Since we{' '}
                    <Link href="/moving-to-spain" className="hyperlink">
                        moved to Spain
                    </Link>{' '}
                    I&apos;m using this blog to keep friends and family up to date.
                </p>
            </header>
            <div className="mt-16 sm:mt-20">
                <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((category) => (
                        <Card key={category.name}>
                            <Card.Title>{category.name}</Card.Title>
                            <Card.Description>{category.description}</Card.Description>
                            <Card.CategoryLink href={category.slug}></Card.CategoryLink>
                        </Card>
                    ))}
                </div>
            </div>
        </Container>
    </Layout>
);

export const getStaticProps = getHomepageStaticProps<BasePageProps, StoryWithImage>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
        featuredStories: await loadFeaturedStories(context),
    }),
);

export default AboutPage;
