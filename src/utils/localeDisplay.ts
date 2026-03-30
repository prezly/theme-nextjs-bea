/**
 * Language codes that map to a different region (language code ≠ country code).
 * lb = Luxembourgish → Luxembourg (LU), not Lebanon (LB)
 * sq = Albanian → Albania (AL); SQ is not a valid ISO 3166-1 region
 * cnr = Montenegrin → Montenegro (ME); CNR is ISO 639-3, not ISO 3166
 * ca = Catalan → Andorra (AD); CA is Canada, but ca used alone = Catalan/Andorra
 * bs = Bosnian → Bosnia and Herzegovina (BA); BS is Bahamas
 */
const LANGUAGE_TO_REGION: Record<string, string> = {
    lb: 'lu',
    sq: 'al',
    cnr: 'me',
    ca: 'ad',
    bs: 'ba',
    // English without a region tag → default to United Kingdom flag (euro market assumption)
    en: 'gb',
};

function normalizeLocaleCode(code: string): string {
    return code
        .trim()
        .toLowerCase()
        .replace(/[_\u2010\u2011]/g, '-');
}

/**
 * Extract a 2-letter country/region code from a locale code for flag rendering.
 *
 * Examples:
 *   "nl-BE" → "be"   (Belgium flag)
 *   "fr-BE" → "be"   (Belgium flag)
 *   "nl-NL" → "nl"   (Netherlands flag)
 *   "nl"    → "nl"   (Netherlands flag)
 *   "pl"    → "pl"
 *   "lb"    → "lu"   (Luxembourgish → Luxembourg)
 */
export function parseLocaleCode(code: string): string | null {
    const normalized = normalizeLocaleCode(code);
    const parts = normalized.split('-').filter(Boolean);

    if (parts.length === 1) {
        const segment = parts[0];
        const mapped = LANGUAGE_TO_REGION[segment];
        if (mapped) return mapped;
        if (segment.length === 2) return segment;
        if (segment.length === 4) return segment.slice(-2);
        return null;
    }

    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 2) return lastPart;

    return null;
}
