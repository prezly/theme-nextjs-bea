import Cookie from 'js-cookie';

import { getCookieConsentDomain } from './getCookieConsentDomain';

const COOKIE_NAME = 'consent';
const COOKIE_EXPIRATION = 365; // in days

export function getConsentCookie(): boolean | null {
    const value = Cookie.get(COOKIE_NAME);
    if (value === undefined) {
        return null;
    }

    try {
        return Boolean(JSON.parse(value));
    } catch (error) {
        return null;
    }
}

export function setConsentCookie(value: boolean): void {
    const domain = getCookieConsentDomain();

    // remove cookie added on the default host (for migration)
    Cookie.remove(COOKIE_NAME);
    // remove cookie added on the specified host
    Cookie.remove(COOKIE_NAME, { domain });
    // write cookie on the specified host
    Cookie.set(COOKIE_NAME, JSON.stringify(value), {
        expires: COOKIE_EXPIRATION,
        domain,
    });
}
