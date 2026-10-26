import { Story as StorySdk } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { headers } from 'next/headers';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

import {
    app,
    generateNewsroomUrl,
    generateStoryPageMetadata,
    NOT_FOUND_REQUEST_HEADER,
    NOT_FOUND_REQUEST_VALUE,
    NOT_FOUND_REWRITE_SLUG,
    routing,
} from '@/adapters/server';
import { JsonLd } from '@/modules/Head';
import { Story } from '@/modules/Story';

import {
    buildNewsArticleSchema,
    isPossibleStorySlug,
    hasPublicUrlOverrides,
    parsePreviewSearchParams,
    sanitizeStories,
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
    const { localeCode, slug } = await params;

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
        // Redirect to the canonical slug through the wrapped generator so the
        // reverse-proxy locale + subdir prefix is preserved (a bare router URL
        // would 404 behind the proxy). `localeCode` is read by our wrapper even
        // though the locale-less `story` route doesn't type it.
        const { generateUrl } = await routing();
        return redirect(generateUrl('story', { slug: story.slug, localeCode } as { slug: string }));
    }

    if (story.visibility === StorySdk.Visibility.PUBLIC && story.seo_settings.canonical_url) {
        const newsroom = await app().newsroom();
        if (newsroom.redirect_to_canonical_url) {
            permanentRedirect(story.seo_settings.canonical_url);
        }
    }

    const { stories: relatedStories } = await app().stories({
        limit: 3,
        locale: localeCode,
        query: JSON.stringify({ slug: { $ne: slug } }),
    });

    return { relatedStories: sanitizeStories(relatedStories), story };
}

/**
 * The theme's own locale-correct absolute URL for a story behind a reverse
 * proxy. `oembed.url` (used by theme-kit for canonical/og:url and by the JSON-LD
 * `url`) is backend-owned and unaware of the public origin and path prefix.
 *
 * Returns `undefined` when neither is configured, so the backend-owned URLs
 * stay in place.
 */
async function generateStoryUrl(story: Pick<StorySdk, 'slug' | 'culture'>) {
    const { basePathConfig, generateAbsoluteUrl } = await routing();
    if (!hasPublicUrlOverrides(basePathConfig)) return undefined;
    // The `story` route pattern is locale-less (`/:slug`), so `localeCode` isn't
    // in its typed params — but our generateAbsoluteUrl wrapper reads it to apply
    // the reverse-proxy locale prefix. Pass it through with a cast.
    return generateAbsoluteUrl('story', {
        slug: story.slug,
        localeCode: story.culture.code,
    } as { slug: string });
}

export async function generateMetadata({ params }: Props) {
    const { story } = await resolve(params);

    const metadata = await generateStoryPageMetadata({ story });

    // theme-kit defaults the canonical/og:url to the backend `oembed.url`, which
    // is unaware of the reverse-proxy path. Behind a reverse proxy, use our own
    // locale-correct URL instead. An explicit `seo_settings.canonical_url` wins.
    const canonical = story.seo_settings.canonical_url ? undefined : await generateStoryUrl(story);
    if (canonical) {
        metadata.alternates = { ...metadata.alternates, canonical };
        if (metadata.openGraph) {
            metadata.openGraph = { ...metadata.openGraph, url: canonical };
        }
    }

    return metadata;
}

export default async function StoryPage(props: Props) {
    const searchParams = await props.searchParams;
    const { story, relatedStories } = await resolve(props.params);
    const [settings, newsroom, companyInformation, storyUrl, newsroomUrl] = await Promise.all([
        app().themeSettings(),
        app().newsroom(),
        app().companyInformation(story.culture.code),
        // Keep the JSON-LD `url` in step with the canonical this page emits in
        // `generateMetadata` — a canonical and a structured-data URL that disagree
        // is worse than either being wrong on its own.
        generateStoryUrl(story),
        generateNewsroomUrl(story.culture.code),
    ]);
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            {story.visibility === StorySdk.Visibility.PUBLIC && (
                <JsonLd
                    schema={buildNewsArticleSchema({
                        story,
                        newsroom,
                        companyInformation,
                        storyUrl,
                        newsroomUrl,
                    })}
                />
            )}
            <Broadcast story={story} />
            <Story
                story={story}
                showDate={themeSettings.show_date}
                withHeaderImage={themeSettings.header_image_placement}
                relatedStories={themeSettings.show_read_more ? relatedStories : []}
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
