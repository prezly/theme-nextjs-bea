import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata } from '@/adapters/server';
import { Story } from '@/modules/Story';
import { parsePreviewSearchParams } from 'utils';

import { Broadcast } from '../components';

interface Props {
    params: {
        localeCode: Locale.Code;
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

export default async function StoryPage({ params, searchParams }: Props) {
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
                sharingOptions={{
                    share_to_facebook: themeSettings.share_to_facebook,
                    share_to_messenger: themeSettings.share_to_messenger,
                    share_to_twitter: themeSettings.share_to_twitter,
                    share_to_telegram: themeSettings.share_to_telegram,
                    share_to_whatsapp: themeSettings.share_to_whatsapp,
                    share_to_linkedin: themeSettings.share_to_linkedin,
                    share_to_pinterest: themeSettings.share_to_pinterest,
                    share_to_reddit: themeSettings.share_to_reddit,
                    share_to_bluesky: themeSettings.share_to_bluesky,
                    share_via_url: themeSettings.share_via_url,
                    share_via_copy: themeSettings.share_via_copy,
                }}
            />
        </>
    );
}
