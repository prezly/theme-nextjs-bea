import { Redirect } from 'next';

import { BasePageProps } from 'types';

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

export function fromSlug(localeSlug: string): string {
    const [language, region] = localeSlug.split('-');

    if (!region) {
        return language;
    }

    return [language, region.toUpperCase()].join('_');
}

export function toSlug(localeCode: string): string {
    return localeCode.replace('_', '-');
}

export function toUrlSlug(localeCode: string): string {
    return toSlug(localeCode).toLowerCase();
}

export function toNeutralLanguageCode(localeCode: string): string {
    const [language] = localeCode.split('_');

    return language;
}

export function toRegionCode(localeCode: string): string {
    if (localeCode.length === 2) {
        return localeCode.toUpperCase();
    }

    const [, region] = localeCode.split('_');

    return region;
}

export function getSupportedLocaleSlug(localeCode: string): string {
    const localeSlug = toSlug(localeCode);

    const isSupportedLocale = localeSlug.length > 2 && SUPPORTED_LOCALES.includes(localeSlug);
    if (isSupportedLocale) {
        return localeSlug;
    }

    const language = localeSlug.slice(0, 2);
    const isSupportedLanguage = SUPPORTED_LOCALES.includes(language);
    if (isSupportedLanguage) {
        return language;
    }

    return DEFAULT_LOCALE;
}

export function getRedirectToCanonicalLocale(
    basePageProps: BasePageProps,
    nextLocale: string | undefined,
    redirectPath: string,
): Redirect | undefined {
    const { shortestLocaleCode } = basePageProps;
    const shortestLocaleSlug = shortestLocaleCode
        ? toUrlSlug(shortestLocaleCode)
        : shortestLocaleCode;

    if (nextLocale === DUMMY_DEFAULT_LOCALE) {
        return undefined;
    }

    if (shortestLocaleSlug !== nextLocale) {
        const prefixedPath =
            redirectPath && !redirectPath.startsWith('/') ? `/${redirectPath}` : redirectPath;

        return {
            destination: shortestLocaleSlug
                ? `/${shortestLocaleSlug}${prefixedPath}`
                : prefixedPath,
            permanent: false,
        };
    }

    return undefined;
}
