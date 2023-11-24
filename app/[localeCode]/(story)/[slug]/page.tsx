import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata, routing } from '@/adapters/server';
import { Story } from '@/modules/Story';

import { Broadcast } from '../components';

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
    const story = await resolveStory(params);

    return (
        <>
            <Broadcast story={story} />
            <Story story={story} />
        </>
    );
}
