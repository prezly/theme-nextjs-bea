/**
 * Languages whose native date order and markers (年/月/日, 년/월/일) cannot be
 * expressed by the newsroom `date_format` setting.
 *
 * The newsroom format is a moment.js pattern like `MMM D, YY` with Latin
 * separators baked in. Substituting localized parts into it gives output such
 * as `9月 22, 26` (Chinese) or `10 1, 26` (Japanese, where the short month is
 * just a number and the month marker is lost). For these languages we drop the
 * custom pattern and let `Intl.DateTimeFormat` render its native long date,
 * e.g. `2026年10月1日` or `2026년 10월 1일`.
 */
const NATIVE_DATE_LANGUAGES = new Set(['ja', 'ko', 'zh']);

function getLanguage(localeCode: string): string {
    return localeCode.split(/[-_]/)[0].toLowerCase();
}

/**
 * Returns the newsroom date format to use for the given locale, or `undefined`
 * when the locale should fall back to the native `Intl` date.
 */
export function resolveDateFormat(
    localeCode: string,
    dateFormat: string | undefined,
): string | undefined {
    if (!dateFormat || NATIVE_DATE_LANGUAGES.has(getLanguage(localeCode))) {
        return undefined;
    }
    return dateFormat;
}
