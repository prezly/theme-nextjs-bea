/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ExtendedStory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata, routing } from '@/adapters/server';
import { Content } from '@/modules/Layout';
import { Story } from '@/modules/Story';

import { Header } from '../Header';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: string;
    };
    searchParams: Record<string, string>;
}

async function resolveStory(params: Props['params']) {
    const { slug } = params;

    return (await app().story({ slug })) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const { generateUrl } = await routing();

    return generateStoryPageMetadata({
        story: () => resolveStory(params),
        generateUrl: (_, story) => generateUrl('story', { slug: story.slug }),
    });
}

export default async function StoryPage({ params }: Props) {
    const story = (await resolveStory(params)) as ExtendedStory; // FIXME: Avoid `as` type casting

    return (
        <>
            <Header story={story} />
            <Content>
                <Story story={story as ExtendedStory} />
            </Content>
        </>
    );
}
