import type { StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { generateStoryPageMetadata, initPrezlyClient } from '@/adapters/server';
import { Story } from '@/modules/Story';

import { Broadcast } from '../../components';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story preview_uuid
    };
}

async function resolve(params: Props['params']) {
    const { uuid } = params;

    // We have to construct a new uncached ContentDelivery client here,
    // to make sure the story preview is ALWAYS using the latest data.
    const { contentDelivery } = initPrezlyClient(headers(), { cache: false });

    const story = await contentDelivery.story({ uuid });
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
