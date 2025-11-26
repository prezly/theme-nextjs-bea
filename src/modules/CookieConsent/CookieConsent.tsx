'use client';

import { Newsroom, type NewsroomLanguageSettings } from '@prezly/sdk';

import { isPreviewActive } from '@/utils';

import { OneTrustCookie, VanillaCookieConsent } from './components';

interface Props {
    language: NewsroomLanguageSettings;
    newsroom: Newsroom;
}

export function CookieConsent({ language, newsroom }: Props) {
    const { tracking_policy: trackingPolicy, onetrust_cookie_consent: onetrust } = newsroom;
    const isPreview = isPreviewActive();

    if (isPreview) {
        return null;
    }

    if (trackingPolicy === Newsroom.TrackingPolicy.LENIENT) {
        return null;
    }

    if (onetrust.is_enabled) {
        return <OneTrustCookie script={onetrust.script} category={onetrust.category} />;
    }

    const cookieStatement =
        language.company_information.cookie_statement || language.default_cookie_statement;

    return <VanillaCookieConsent cookieStatement={cookieStatement} />;
}
