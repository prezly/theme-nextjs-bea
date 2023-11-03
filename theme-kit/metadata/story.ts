import { Story } from '@prezly/sdk';
import type { Metadata } from 'next';

import { routing } from '@/theme-kit';

import { generateAlternateLanguageLinks, generateMetadata } from './utils';

interface Params {
    story: Story;
    isPreview?: boolean;
    isSecret?: boolean;
}

export async function generateStoryMetadata({
    story,
    isPreview = false,
    isSecret = false,
}: Params): Promise<Metadata> {
    const { generateUrl } = await routing();

    function generateStoryUrl(params: Pick<Story, 'uuid' | 'slug'>) {
        if (isPreview) {
            return generateUrl('previewStory', params);
        }
        return generateUrl('story', params);
    }

    const { author, oembed } = story;

    const localeCode = story.culture.code;
    const authorName = author?.display_name || author?.email;

    const title =
        story.seo_settings.meta_title || story.seo_settings.default_meta_title || story.title;

    const description =
        story.seo_settings.meta_description ||
        story.seo_settings.default_meta_description ||
        story.subtitle ||
        story.summary;

    const canonical = story.seo_settings.canonical_url || oembed.url;

    const languages = await generateAlternateLanguageLinks((locale) => {
        const translation = story.translations.find((t) => t.culture.code === locale.code);
        return translation && Story.isPublished(translation)
            ? generateStoryUrl(translation)
            : undefined;
    });

    return generateMetadata({
        localeCode,
        imageUrl: oembed.thumbnail_url,
        title: isPreview ? `[Preview]: ${title}` : title,
        description,
        alternates: {
            canonical,
            types: {
                'application/json': `${oembed.url}.json`,
            },
            languages,
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
    });
}
