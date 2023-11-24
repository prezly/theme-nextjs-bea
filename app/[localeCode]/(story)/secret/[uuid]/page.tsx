import type { StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata } from '@/adapters/server';
import { Story } from '@/modules/Story';

import { Broadcast } from '../../components';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story secret_uuid
    };
}

async function resolveStory(params: Props['params']) {
    const { uuid } = params;

    return (await app().story({ uuid })) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    return generateStoryPageMetadata({
        story: () => resolveStory(params),
        isSecret: true,
    });
}

export default async function SecretStoryPage({ params }: Props) {
    const story = await resolveStory(params);

    return (
        <>
            <Broadcast story={story} />
            <Story story={story} />
        </>
    );
}
