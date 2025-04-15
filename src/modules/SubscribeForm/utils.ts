import { DEFAULT_LOCALE, Locale, translations } from '@prezly/theme-kit-nextjs';

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function validateEmail(email: string) {
    if (!email) {
        return translations.errors.fieldRequired;
    }
    if (!EMAIL_REGEX.test(email)) {
        return translations.errors.emailInvalid;
    }

    return undefined;
}

// This list is a shorter version of the table @ https://docs.hcaptcha.com/languages/
const HCAPTCHA_SUPPORTED_LOCALES = [
    'af',
    'ar',
    'az',
    'be',
    'bg',
    'zh',
    'zh-CN',
    'zh-TW',
    'hr',
    'cs',
    'da',
    'nl',
    'en',
    'et',
    'fi',
    'fr',
    'de',
    'el',
    'he',
    'hi',
    'hu',
    'id',
    'ga',
    'it',
    'ja',
    'kk',
    'ky',
    'ko',
    'lv',
    'lt',
    'ms',
    'mt',
    'no',
    'pl',
    'pt',
    'ro',
    'ru',
    'sk',
    'sl',
    'es',
    'sv',
    'th',
    'tr',
    'uk',
    'ur',
    'uz',
    'vi',
];

export function getLocaleCodeForCaptcha(locale: Locale | Locale.AnyCode): string {
    const { code, lang } = Locale.from(locale);
    if (HCAPTCHA_SUPPORTED_LOCALES.includes(code)) {
        return code;
    }

    if (HCAPTCHA_SUPPORTED_LOCALES.includes(lang)) {
        return lang;
    }

    return DEFAULT_LOCALE;
}
