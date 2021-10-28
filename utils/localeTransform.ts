export function convertToPrezlyFormat(locale: string) {
    return locale.replace('-', '_');
}

export function convertToBrowserFormat(locale: string) {
    return locale.replace('_', '-');
}

export function getShortLocale(locale: string) {
    return locale.split('-')[0];
}

const FULL_LOCALE_BY_SHORT_LOCALE: Record<string, string> = {
    af: 'af-ZA',
    cs: 'cs-CZ',
    da: 'da-DK',
    // eslint-disable-next-line id-blacklist
    el: 'el-GR',
    et: 'et-EE',
    ga: 'ga-IE',
    he: 'he-IL',
    hi: 'hi-IN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    ms: 'ms-MY',
    nb: 'nb-NO',
    sl: 'sl-SI',
    sv: 'sv-SE',
    uk: 'uk-UA',
    ur: 'ur-PK',
    vi: 'vi-VN',
    zh: 'zh-CN',
};

export function getRegionalLocaleFromShortLocale(locale: string) {
    return FULL_LOCALE_BY_SHORT_LOCALE[locale] ?? `${locale}-${locale.toUpperCase()}`;
}
