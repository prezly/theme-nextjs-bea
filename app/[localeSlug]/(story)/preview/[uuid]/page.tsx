import type { StoryRef } from '@prezly/sdk';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata } from '@/adapters/server';
import { Story } from '@/modules/Story';

import { Broadcast } from '../../components';

interface Props {
    params: {
        localeSlug: string;
        uuid: StoryRef['uuid']; // story preview_uuid
    };
}

async function resolve(params: Props['params']) {
    const { uuid } = params;

    const story = await app().story({ uuid });
    if (!story) notFound();

    return { story };
}

export async function generateMetadata({ params }: Props) {
    const { story } = await resolve(params);
    return generateStoryPageMetadata({ story, isPreview: true });
}

export default async function PreviewStoryPage({ params }: Props) {
    const { story } = await resolve(params);

    return (
        <>
            <Broadcast story={story} isPreview />
            <Story story={story} />
        </>
    );
}
