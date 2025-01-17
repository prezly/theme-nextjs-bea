import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { OneTrustCookie, VanillaCookieConsent } from './components';

interface Props {
    localeCode: Locale.Code;
}

export async function CookieConsent({ localeCode }: Props) {
    // TODO: remove or use language constant
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const language = await app().languageOrDefault(localeCode);
    const { onetrust_cookie_consent: onetrust } = await app().newsroom();

    if (onetrust.is_enabled) {
        return <OneTrustCookie script={onetrust.script} category={onetrust.category} />;
    }

    return <VanillaCookieConsent />;
}
