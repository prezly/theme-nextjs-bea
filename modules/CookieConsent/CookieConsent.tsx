import { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { OneTrustCookie, VanillaCookieConsent } from './components';
import { getPolicyLink } from './utils';

interface Props {
    localeCode: Locale.Code;
}

export async function CookieConsent({ localeCode }: Props) {
    const {
        tracking_policy: trackingPolicy,
        onetrust_cookie_consent: onetrust,
        policies,
    } = await app().newsroom();

    if (trackingPolicy === Newsroom.TrackingPolicy.LENIENT) {
        return null;
    }

    if (onetrust.is_enabled) {
        return <OneTrustCookie script={onetrust.script} category={onetrust.category} />;
    }

    const privacyPolicyLink = getPolicyLink(policies.privacy_policy);
    const cookiePolicyLink = getPolicyLink(policies.cookie_policy);
    const language = await app().languageOrDefault(localeCode);
    const cookieStatement =
        language.company_information.cookie_statement || language.default_cookie_statement;

    return (
        <VanillaCookieConsent
            cookieStatement={cookieStatement}
            cookiePolicyLink={cookiePolicyLink}
            privacyPolicyLink={privacyPolicyLink}
        />
    );
}
