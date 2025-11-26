'use client';

import {
    Newsroom,
    type NewsroomCompanyInformation,
    type NewsroomLanguageSettings,
} from '@prezly/sdk';

import { isPreviewActive } from '@/utils';

import { OneTrustCookie, VanillaCookieConsent } from './components';

interface Props {
    cookieStatement: NewsroomCompanyInformation['cookie_statement'];
    defaultCookieStatement: NewsroomLanguageSettings['default_cookie_statement'];
    newsroom: Pick<Newsroom, 'tracking_policy' | 'onetrust_cookie_consent'>;
}

export function CookieConsent({ cookieStatement, defaultCookieStatement, newsroom }: Props) {
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

    return <VanillaCookieConsent cookieStatement={cookieStatement || defaultCookieStatement} />;
}
