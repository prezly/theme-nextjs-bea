import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { CookieConsentBar } from './components/CookieConsentBar';

interface Props {
    localeCode: Locale.Code;
}

export async function CookieConsent({ localeCode }: Props) {
    const language = await app().languageOrDefault(localeCode);

    return <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>;
}
