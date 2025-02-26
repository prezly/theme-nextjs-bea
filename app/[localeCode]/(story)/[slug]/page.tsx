import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata } from '@/adapters/server';
import { Story } from '@/modules/Story';
import { parsePreviewSearchParams } from '@/utils';

import { Broadcast } from '../components';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        slug: string;
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { localeCode, slug } = await params;

    const story = await app().story({ slug });
    if (!story) notFound();

    const { stories: relatedStories } = await app().stories({
        limit: 3,
        locale: localeCode,
        query: JSON.stringify({ slug: { $ne: slug } }),
    });

    return { relatedStories, story };
}

export async function generateMetadata({ params }: Props) {
    const { story } = await resolve(params);

    return generateStoryPageMetadata({ story });
}

export default async function StoryPage(props: Props) {
    const searchParams = await props.searchParams;
    const { story, relatedStories } = await resolve(props.params);
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            <Broadcast story={story} />
            <Story
                story={story}
                showDate={themeSettings.show_date}
                withHeaderImage={themeSettings.header_image_placement}
                relatedStories={themeSettings.show_read_more ? relatedStories : []}
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
