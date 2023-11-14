import { Story } from '@prezly/sdk';
import type { StoryRef } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { type AsyncResolvable, resolveAsync } from '@/theme-kit/resolvable';

import type { Prerequisites, Url } from './types';
import { generatePageMetadata } from './utils';

interface Params extends Omit<Prerequisites, 'locale'> {
    story: AsyncResolvable<Story>;
    isPreview?: boolean;
    isSecret?: boolean;

    generateUrl?: (locale: Locale.Code, story: StoryRef) => Url | undefined;
}

export async function generateStoryPageMetadata(
    { isPreview = false, isSecret = false, generateUrl, ...resolvable }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const story = await resolveAsync(resolvable.story);

    function generateStoryUrl(localeCode: Locale.Code, translation: StoryRef) {
        if (Story.isPublished(translation)) {
            return generateUrl?.(localeCode, translation);
        }
        return undefined;
    }

    const { author, oembed } = story;

    const locale = story.culture.code;
    const authorName = author?.display_name || author?.email;

    const title =
        story.seo_settings.meta_title || story.seo_settings.default_meta_title || story.title;

    const description =
        story.seo_settings.meta_description ||
        story.seo_settings.default_meta_description ||
        story.subtitle ||
        story.summary;

    const canonical = story.seo_settings.canonical_url || oembed.url;

    return generatePageMetadata(
        {
            ...resolvable,
            locale,
            imageUrl: oembed.thumbnail_url,
            title: isPreview ? `[Preview]: ${title}` : title,
            description,
            generateUrl: (localeCode) => {
                const target = [story, ...story.translations].find(
                    (translation) => translation.culture.code === localeCode,
                );
                if (target) {
                    return generateStoryUrl(localeCode, target);
                }
                return undefined;
            },
        },
        {
            alternates: {
                canonical,
                types: Story.isPublished(story)
                    ? { 'application/json': `${oembed.url}.json` }
                    : undefined,
            },
            robots: isPreview || isSecret ? { index: false, follow: false } : undefined,
            openGraph: {
                title: story.title,
                description,
                url: oembed.url,
                type: 'article',
                publishedTime: story.published_at ?? undefined,
                modifiedTime: story.updated_at,
                authors: authorName ? [authorName] : undefined,
                images: oembed.thumbnail_url && [
                    {
                        url: oembed.thumbnail_url,
                        alt: oembed.title,
                        width: oembed.width,
                        height: oembed.height,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
            },
        },
        ...metadata,
    );
}

export namespace generateStoryPageMetadata {
    export type Parameters = Params;
}
