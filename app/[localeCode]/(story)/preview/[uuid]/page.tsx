import type { StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata, initPrezlyClient } from '@/adapters/server';
import { Story } from '@/modules/Story';
import { parsePreviewSearchParams } from '@/utils';

import { Broadcast } from '../../components';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story preview_uuid
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { uuid } = await params;

    // We have to construct a new uncached ContentDelivery client here,
    // to make sure the story preview is ALWAYS using the latest data.
    const { contentDelivery } = initPrezlyClient(await headers(), { cache: false });

    const story = await contentDelivery.story({ uuid });
    if (!story) notFound();

    return { story };
}

export async function generateMetadata(props: Props) {
    const { story } = await resolve(props.params);
    return generateStoryPageMetadata({ story, isPreview: true });
}

export default async function PreviewStoryPage(props: Props) {
    const searchParams = await props.searchParams;
    const { story } = await resolve(props.params);
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            <Broadcast story={story} isPreview />
            <Story
                story={story}
                showDate={settings.show_date}
                withHeaderImage={themeSettings.header_image_placement}
                withSharingIcons={themeSettings.show_sharing_icons}
            />
        </>
    );
}
