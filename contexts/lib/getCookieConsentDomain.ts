export function getCookieConsentDomain(): string {
    const metaElement = document.querySelector(
        'meta[name="prezly:cookie_consent_domain"]',
    ) as HTMLMetaElement | null;

    if (metaElement) {
        return metaElement.content;
    }

    return document.location.hostname;
}
