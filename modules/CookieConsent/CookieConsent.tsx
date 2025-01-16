import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { OneTrustCookie } from './components';
import { CookieConsentBar } from './components/CookieConsentBar';

interface Props {
    localeCode: Locale.Code;
}

export async function CookieConsent({ localeCode }: Props) {
    const language = await app().languageOrDefault(localeCode);
    const { onetrust_cookie_consent: onetrust } = await app().newsroom();

    if (onetrust.is_enabled) {
        return <OneTrustCookie script={onetrust.script} category={onetrust.category} />;
    }

    return <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>;
}
