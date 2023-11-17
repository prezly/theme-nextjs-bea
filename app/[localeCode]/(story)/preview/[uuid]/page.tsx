import type { ExtendedStory, StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata, routing } from '@/adapters/server';
import { Story } from '@/modules/Story';

import { Broadcast } from '../../components';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story preview_uuid
    };
}

async function resolveStory(params: Props['params']) {
    const { uuid } = params;

    return (await app().story({ uuid })) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const { generateUrl } = await routing();

    return generateStoryPageMetadata({
        story: () => resolveStory(params),
        generateUrl: (_, story) => generateUrl('story', { slug: story.slug }),
        isPreview: true,
    });
}

export default async function PreviewStoryPage({ params }: Props) {
    const story = (await resolveStory(params)) as ExtendedStory; // FIXME: Avoid `as` type casting;

    return (
        <>
            <Broadcast story={story} isPreview />
            <Story story={story as ExtendedStory} />
        </>
    );
}
