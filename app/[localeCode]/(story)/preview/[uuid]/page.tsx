import type { StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata, initPrezlyClient } from '@/adapters/server';
import { Story } from '@/modules/Story';
import { parsePreviewSearchParams } from 'utils';

import { Broadcast } from '../../components';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: StoryRef['uuid']; // story preview_uuid
    };
    searchParams: Record<string, string>;
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

export default async function PreviewStoryPage({ params, searchParams }: Props) {
    const { story } = await resolve(params);
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            <Broadcast story={story} isPreview />
            <Story
                story={story}
                showDate={settings.show_date}
                withHeaderImage={themeSettings.header_image_placement}
                actions={{
                    show_copy_content: themeSettings.show_copy_content,
                    show_copy_url: themeSettings.show_copy_url,
                    show_download_assets: themeSettings.show_download_assets,
                    show_download_pdf: themeSettings.show_download_pdf,
                }}
                sharingOptions={{
                    sharing_placement: themeSettings.sharing_placement,
                    sharing_actions: themeSettings.sharing_actions,
                }}
            />
        </>
    );
}
