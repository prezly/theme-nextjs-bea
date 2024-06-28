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
    searchParams: {
        header_image_placement?: string;
        show_sharing_icons?: string;
    };
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
                withHeaderImage={themeSettings.header_image_placement}
                withSharingIcons={themeSettings.show_sharing_icons}
            />
        </>
    );
}
