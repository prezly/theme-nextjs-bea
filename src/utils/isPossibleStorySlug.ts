/**
 * Characters the Prezly API refuses in a story slug (see the API's SlugValidator).
 * Generated slugs are stricter still: letters, digits and hyphens only.
 * Custom slugs may contain any other character, including dots.
 */
const FORBIDDEN_CHARACTERS = /[&$+,/:;=?@# <>[\]{}|\\^%!']/;

/**
 * File extensions that scanners and crawlers probe for and that no newsroom
 * would choose as a custom story slug. `.html` and `.pdf` are deliberately
 * absent: migrated sites keep old document URLs as custom slugs.
 */
const SCANNER_EXTENSION =
    /\.(?:php\d?|phtml|asp|aspx|jsp|jspx|cgi|pl|py|rb|sh|bat|cmd|exe|dll|env|git|svn|sql|db|sqlite|bak|old|orig|swp|tmp|zip|tar|gz|tgz|rar|7z|log|ini|conf|config|yml|yaml|toml|json|xml|txt|md|ico|js|mjs|cjs|css|map|woff2?|ttf|eot|otf|png|jpe?g|gif|svg|webp|avif|wasm)$/i;

/**
 * Whether a single path segment could be a story slug at all.
 *
 * The story route accepts any single segment, so every probe such as
 * `/favicon.ico`, `/wp-login.php` or `/tel:+123` used to reach the story API
 * twice: once from the Edge middleware, once from the Node page. Rejecting
 * segments the API could never have stored answers those with a 404 and no
 * API call. Valid slugs, including percent-encoded non-ASCII ones, pass.
 *
 * Accepts the raw (possibly percent-encoded) segment as well as a decoded one.
 */
export function isPossibleStorySlug(segment: string): boolean {
    if (!segment) return false;

    let slug: string;
    try {
        slug = decodeURIComponent(segment);
    } catch {
        return false;
    }

    if (!slug || FORBIDDEN_CHARACTERS.test(slug)) return false;

    return !SCANNER_EXTENSION.test(slug);
}
