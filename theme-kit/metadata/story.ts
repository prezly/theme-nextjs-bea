import type { Story } from '@prezly/sdk';
import type { Metadata } from 'next';

import { generateMetadata } from './utils';

interface Params {
    story: Story;
    isPreview?: boolean;
    isSecret?: boolean;
}

export function generateStoryMetadata({
    story,
    isPreview = false,
    isSecret = false,
}: Params): Promise<Metadata> {
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

    return generateMetadata({
        localeCode,
        title: isPreview ? `[Preview]: ${title}` : title,
        description,
        alternates: {
            canonical,
            types: {
                'application/json': `${oembed.url}.json`,
            },
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
            images: oembed.thumbnail_url && [oembed.thumbnail_url],
        },
    });
}
