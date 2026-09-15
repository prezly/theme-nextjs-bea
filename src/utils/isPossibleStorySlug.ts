/**
 * Characters the Prezly API refuses in a story slug (see the API's SlugValidator).
 * Generated slugs are stricter still: letters, digits and hyphens only.
 * Custom slugs may contain any other character, including dots.
 */
const FORBIDDEN_CHARACTERS = /[&$+,/:;=?@# <>[\]{}|\\^%!']/;

/**
 * Extensions of assets, configuration and archives that scanners probe for.
 * Kept deliberately narrow: no page-like extensions (`.php`, `.asp`, `.html`,
 * `.pdf`), which migrated sites keep as custom slugs, and no two-letter
 * suffixes that collide with domain-like slugs (`firma.pl`). In the 2026-09-15
 * samples no successful story path ended in any extension at all.
 */
const SCANNER_EXTENSION =
    /\.(?:js|css|map|ico|png|jpg|jpeg|gif|svg|webp|xml|txt|yml|yaml|ini|conf|cfg|toml|env|sql|bak|backup|log|zip|tar|gz|rar|7z)$/i;

export type StorySlugRejection =
    | 'empty'
    | 'invalid_encoding'
    | 'forbidden_character'
    | 'dotfile'
    | 'scanner_extension';

/**
 * Why a single path segment cannot be a story slug, or `undefined` when it can.
 *
 * The story route accepts any single segment, so every probe such as
 * `/favicon.ico`, `/.env.local` or `/tel:+123` used to reach the story API
 * twice: once from the Edge middleware, once from the Node page. Rejecting
 * segments the API could never have stored answers those with a 404 and no
 * API call. Valid slugs, including percent-encoded non-ASCII ones, dots
 * inside a slug and page-like extensions, pass.
 *
 * Accepts the raw (possibly percent-encoded) segment as well as a decoded one.
 */
export function getStorySlugRejection(segment: string): StorySlugRejection | undefined {
    if (!segment) return 'empty';

    let slug: string;
    try {
        slug = decodeURIComponent(segment);
    } catch {
        return 'invalid_encoding';
    }

    if (!slug) return 'empty';
    if (FORBIDDEN_CHARACTERS.test(slug)) return 'forbidden_character';
    // `.env`, `.git`, `.dockerfile`: never a public page, always a probe.
    if (slug.startsWith('.')) return 'dotfile';
    if (SCANNER_EXTENSION.test(slug)) return 'scanner_extension';

    return undefined;
}

export function isPossibleStorySlug(segment: string): boolean {
    return getStorySlugRejection(segment) === undefined;
}
