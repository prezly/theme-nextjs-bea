import type { Locale } from '@prezly/theme-kit-nextjs';
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

interface Props {
    localeCode: Locale.Code;
}

export async function CookieConsent({ localeCode }: Props) {
    const language = await app().languageOrDefault(localeCode);

    return <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>;
}
