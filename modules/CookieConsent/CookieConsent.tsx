import dynamic from 'next/dynamic';

import { app } from '@/adapters/server';

const CookieConsentBar = dynamic(
    async () => {
        const component = await import('./components/CookieConsentBar');
        return { default: component.CookieConsentBar };
    },
    {
        ssr: false,
    },
);

export async function CookieConsent() {
    const localeCode = app().locale();
    const language = await app().languageOrDefault(localeCode);

    return <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>;
}
