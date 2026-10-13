import { Story as StorySdk } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { headers } from 'next/headers';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

import {
    app,
    configureAppRouter,
    generateStoryPageMetadata,
    NOT_FOUND_REQUEST_HEADER,
    NOT_FOUND_REQUEST_VALUE,
    NOT_FOUND_REWRITE_SLUG,
} from '@/adapters/server';
import { JsonLd } from '@/modules/Head';
import { Story } from '@/modules/Story';

import {
    buildNewsArticleSchema,
    getRelatedStories,
    isPossibleStorySlug,
    parsePreviewSearchParams,
} from '@/utils';

import { Broadcast } from '../components';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        slug: string;
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { slug } = await params;

    // The middleware's own not-found rewrite lands here with the sentinel slug
    // and a marker header. Only that combination skips the lookup: a story
    // whose custom slug happens to be `_error404` arrives without the marker.
    if (slug === NOT_FOUND_REWRITE_SLUG) {
        const requestHeaders = await headers();
        if (requestHeaders.get(NOT_FOUND_REQUEST_HEADER) === NOT_FOUND_REQUEST_VALUE) notFound();
    }

    // The middleware already rejects impossible slugs before its own lookup.
    // Repeat the check so a direct request to the internal `/:localeCode/:slug`
    // path never reaches the story API either.
    if (!isPossibleStorySlug(slug)) notFound();

    const story = await app().story({ slug });
    if (!story) notFound();

    if (story.slug !== slug && encodeURIComponent(story.slug) !== slug) {
        return redirect(configureAppRouter().generate('story', { slug: story.slug }));
    }

    if (story.visibility === StorySdk.Visibility.PUBLIC && story.seo_settings.canonical_url) {
        const newsroom = await app().newsroom();
        if (newsroom.redirect_to_canonical_url) {
            permanentRedirect(story.seo_settings.canonical_url);
        }
    }

    return story;
}

export async function generateMetadata({ params }: Props) {
    const story = await resolve(params);

    return generateStoryPageMetadata({ story });
}

export default async function StoryPage(props: Props) {
    const [story, settings, searchParams, { localeCode }] = await Promise.all([
        resolve(props.params),
        app().themeSettings(),
        props.searchParams,
        props.params,
    ]);
    const themeSettings = parsePreviewSearchParams(searchParams, settings);
    const [relatedStories, newsroom, companyInformation] = await Promise.all([
        getRelatedStories(app().stories, {
            story,
            locale: localeCode,
            showReadMore: themeSettings.show_read_more,
        }),
        app().newsroom(),
        app().companyInformation(story.culture.code),
    ]);

    return (
        <>
            {story.visibility === StorySdk.Visibility.PUBLIC && (
                <JsonLd schema={buildNewsArticleSchema({ story, newsroom, companyInformation })} />
            )}
            <Broadcast story={story} />
            <Story
                story={story}
                showDate={themeSettings.show_date}
                withHeaderImage={themeSettings.header_image_placement}
                relatedStories={relatedStories}
                hasRelatedStories={themeSettings.show_read_more}
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
                withBadges={themeSettings.story_card_variant === 'boxed'}
            />
        </>
    );
}
