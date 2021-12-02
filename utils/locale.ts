export const DEFAULT_LOCALE = 'en';
export const DUMMY_DEFAULT_LOCALE = 'qps-ploc';

const SUPPORTED_LOCALES = [
    'af',
    'ar',
    'az',
    'be',
    'bg',
    'cs',
    'da',
    'de',
    'el',
    'en',
    'es',
    'et',
    'fi',
    'fil',
    'fr',
    'ga',
    'he',
    'hi',
    'hr',
    'hu',
    'id',
    'it',
    'ja',
    'kk',
    'ko',
    'lt',
    'lv',
    'mt',
    'nl',
    'no',
    'pl',
    'pt-BR',
    'pt',
    'ro',
    'ru',
    'sk',
    'sl',
    'sv',
    'th',
    'tr',
    'uk',
    'ur',
    'uz',
    'vi',
    'zh-CN',
    'zh-TW',
];

export function fromSlug(locale: string): string {
    const [language, country] = locale.split('-');

    if (!country) {
        return language;
    }

    return [language, country.toUpperCase()].join('_');
}

export function toSlug(locale: string): string {
    return locale.replace('_', '-').toLowerCase();
}

export function getSupportedLocale(locale: string): string {
    const isSupportedLocale = locale.length > 2 && SUPPORTED_LOCALES.includes(locale);
    if (isSupportedLocale) {
        return locale;
    }

    const language = locale.slice(0, 2);
    const isSupportedLanguage = SUPPORTED_LOCALES.includes(language);
    if (isSupportedLanguage) {
        return language;
    }

    return DEFAULT_LOCALE;
}
