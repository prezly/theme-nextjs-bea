import type { Newsroom, NewsroomCompanyInformation, Story } from '@prezly/sdk';
import { Locale, Newsrooms } from '@prezly/theme-kit-nextjs';

export type JsonLdSchema = Record<string, unknown>;

const SOCIAL_LINK_KEYS = [
    'twitter',
    'facebook',
    'linkedin',
    'instagram',
    'youtube',
    'tiktok',
    'pinterest',
] as const;

type PublisherNewsroom = Pick<Newsroom, 'name' | 'url' | 'newsroom_logo'>;
type PublisherCompanyInformation = Pick<
    NewsroomCompanyInformation,
    'name' | (typeof SOCIAL_LINK_KEYS)[number]
>;

/**
 * Escapes `<` so a value containing `</script>` (e.g. a story title) can't break out of the
 * `<script type="application/ld+json">` tag it's serialized into.
 */
export function serializeJsonLd(schema: JsonLdSchema | JsonLdSchema[]): string {
    return JSON.stringify(schema).replace(/</g, '\\u003c');
}

function buildPublisherSchema({
    newsroom,
    companyInformation,
}: {
    newsroom: PublisherNewsroom;
    companyInformation: PublisherCompanyInformation;
}): JsonLdSchema {
    const logo = Newsrooms.getLogoUrl(newsroom);
    const sameAs = SOCIAL_LINK_KEYS.map((key) => companyInformation[key]).filter(
        (url): url is string => Boolean(url),
    );

    return {
        '@type': 'Organization',
        name: companyInformation.name || newsroom.name,
        url: newsroom.url,
        ...(logo && { logo: { '@type': 'ImageObject', url: logo } }),
        ...(sameAs.length > 0 && { sameAs }),
    };
}

export function buildOrganizationSchema(params: {
    newsroom: PublisherNewsroom;
    companyInformation: PublisherCompanyInformation;
}): JsonLdSchema {
    return {
        '@context': 'https://schema.org',
        ...buildPublisherSchema(params),
    };
}

export function buildNewsArticleSchema({
    story,
    newsroom,
    companyInformation,
}: {
    story: Story;
    newsroom: PublisherNewsroom;
    companyInformation: PublisherCompanyInformation;
}): JsonLdSchema {
    const { oembed, author } = story;
    const headline =
        story.seo_settings.meta_title || story.seo_settings.default_meta_title || story.title;
    const description =
        story.seo_settings.meta_description ||
        story.seo_settings.default_meta_description ||
        story.subtitle ||
        story.summary;
    const url = story.seo_settings.canonical_url || oembed.url;

    return {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline,
        ...(description && { description }),
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        ...(oembed.thumbnail_url && {
            image: {
                '@type': 'ImageObject',
                url: oembed.thumbnail_url,
                ...(oembed.width && { width: oembed.width }),
                ...(oembed.height && { height: oembed.height }),
            },
        }),
        ...(story.published_at && { datePublished: story.published_at }),
        dateModified: story.updated_at,
        ...(author && { author: { '@type': 'Person', name: author.display_name } }),
        publisher: buildPublisherSchema({ newsroom, companyInformation }),
        inLanguage: Locale.from(story.culture.code).isoCode,
    };
}
