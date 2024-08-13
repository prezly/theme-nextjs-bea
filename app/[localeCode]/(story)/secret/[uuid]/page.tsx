import type { StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata } from '@/adapters/server';
import { Story } from '@/modules/Story';
import { parsePreviewSearchParams } from 'utils';

import { Broadcast } from '../../components';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story secret_uuid
    };
    searchParams: Record<string, string>;
}

async function resolve(params: Props['params']) {
    const { uuid } = params;

    const story = await app().story({ uuid });
    if (!story) notFound();

    return { story };
}

export async function generateMetadata({ params }: Props) {
    const { story } = await resolve(params);
    return generateStoryPageMetadata({ story, isSecret: true });
}

export default async function SecretStoryPage({ params, searchParams }: Props) {
    const { story } = await resolve(params);
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            <Broadcast story={story} />
            <Story
                story={story}
                showDate={themeSettings.show_date}
                withHeaderImage={themeSettings.header_image_placement}
                withSharingIcons={themeSettings.show_sharing_icons}
            />
        </>
    );
}
