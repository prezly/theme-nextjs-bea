import type { Newsroom, NewsroomCompanyInformation, Story } from '@prezly/sdk';
import { Locale, Newsrooms } from '@prezly/theme-kit-nextjs';

// Imported from the module rather than the `SocialMedia` barrel: the barrel pulls
// in React components and SVG assets, which this pure schema builder doesn't need
// (and which make it unloadable outside the Next bundler, e.g. in tests).
import { getSocialLinks } from '@/components/SocialMedia/utils';

export type JsonLdSchema = Record<string, unknown>;

type PublisherNewsroom = Pick<Newsroom, 'name' | 'url' | 'newsroom_logo'>;
type PublisherCompanyInformation = NewsroomCompanyInformation;

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
    newsroomUrl,
}: {
    newsroom: PublisherNewsroom;
    companyInformation: PublisherCompanyInformation;
    /**
     * Reverse-proxy-correct newsroom URL. `newsroom.url` is the backend origin and
     * is unaware of `THEME_BASE_PATH` / `THEME_LOCALE_SUBDIR`, so behind a proxy it
     * points at a path that doesn't exist. Defaults to `newsroom.url`.
     */
    newsroomUrl?: string;
}): JsonLdSchema {
    const logo = Newsrooms.getLogoUrl(newsroom);
    const sameAs = Object.values(getSocialLinks(companyInformation)).filter((url): url is string =>
        Boolean(url),
    );

    return {
        '@type': 'Organization',
        name: companyInformation.name || newsroom.name,
        url: newsroomUrl || newsroom.url,
        ...(logo && { logo: { '@type': 'ImageObject', url: logo } }),
        ...(sameAs.length > 0 && { sameAs }),
    };
}

export function buildOrganizationSchema(params: {
    newsroom: PublisherNewsroom;
    companyInformation: PublisherCompanyInformation;
    newsroomUrl?: string;
}): JsonLdSchema {
    const { seo_settings, about_plaintext } = params.companyInformation;
    const description =
        seo_settings.meta_description || seo_settings.default_meta_description || about_plaintext;

    return {
        '@context': 'https://schema.org',
        ...buildPublisherSchema(params),
        ...(description && { description }),
    };
}

/**
 * Preferred signal for Google Search site names.
 * @see https://developers.google.com/search/docs/appearance/site-names
 *
 * Must be rendered on the site homepage (domain/subdomain root), not on
 * every page. Includes the lowercase hostname as `alternateName` so Google
 * has a fallback if it rejects the preferred brand name.
 */
export function buildWebsiteSchema({
    newsroom,
    companyInformation,
}: {
    newsroom: PublisherNewsroom;
    companyInformation: PublisherCompanyInformation;
}): JsonLdSchema {
    const name = companyInformation.name || newsroom.name;
    const hostname = getHostname(newsroom.url);
    const alternateName =
        hostname && hostname.toLowerCase() !== name.toLowerCase() ? hostname : undefined;

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url: newsroom.url,
        ...(alternateName && { alternateName }),
    };
}

function getHostname(url: string): string | undefined {
    try {
        return new URL(url).hostname.toLowerCase();
    } catch {
        return undefined;
    }
}

export function buildNewsArticleSchema({
    story,
    newsroom,
    companyInformation,
    storyUrl,
    newsroomUrl,
}: {
    story: Story;
    newsroom: PublisherNewsroom;
    companyInformation: PublisherCompanyInformation;
    /**
     * Reverse-proxy-correct story URL, used when the story has no explicitly-set
     * backend canonical. Mirrors the canonical/og:url fallback on the story page:
     * `oembed.url` is backend-owned and doesn't carry the proxy prefix.
     */
    storyUrl?: string;
    newsroomUrl?: string;
}): JsonLdSchema {
    const { oembed, author } = story;
    const headline =
        story.seo_settings.meta_title || story.seo_settings.default_meta_title || story.title;
    const description =
        story.seo_settings.meta_description ||
        story.seo_settings.default_meta_description ||
        story.subtitle ||
        story.summary;
    // An explicit backend canonical always wins (see docs/REVERSE_PROXY.md).
    const url = story.seo_settings.canonical_url || storyUrl || oembed.url;

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
        publisher: buildPublisherSchema({ newsroom, companyInformation, newsroomUrl }),
        inLanguage: Locale.from(story.culture.code).isoCode,
    };
}
