import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata } from '@/adapters/server';
import { Story } from '@/modules/Story';

import { Broadcast } from '../components';

interface Props {
    params: {
        localeSlug: string;
        slug: string;
    };
    searchParams: Record<string, string>;
}

async function resolve(params: Props['params']) {
    const { slug } = params;

    const story = await app().story({ slug });
    if (!story) notFound();

    return { story };
}

export async function generateMetadata({ params }: Props) {
    const { story } = await resolve(params);

    return generateStoryPageMetadata({ story });
}

export default async function StoryPage({ params }: Props) {
    const { story } = await resolve(params);

    return (
        <>
            <Broadcast story={story} />
            <Story story={story} />
        </>
    );
}