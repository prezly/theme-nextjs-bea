import type { LocaleObject } from '@prezly/theme-kit-nextjs';
import { DEFAULT_LOCALE } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import type { MessageDescriptor } from 'react-intl';

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function validateEmail(email: string): MessageDescriptor | undefined {
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

export function getLocaleCodeForCaptcha(locale: LocaleObject): string {
    const fullLocaleCode = locale.toHyphenCode();
    if (HCAPTCHA_SUPPORTED_LOCALES.includes(fullLocaleCode)) {
        return fullLocaleCode;
    }

    const shortLocaleCode = locale.toNeutralLanguageCode();
    if (HCAPTCHA_SUPPORTED_LOCALES.includes(shortLocaleCode)) {
        return shortLocaleCode;
    }

    return DEFAULT_LOCALE;
}
