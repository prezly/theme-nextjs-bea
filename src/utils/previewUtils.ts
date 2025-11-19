import Cookies from 'js-cookie';

import { PREVIEW_COOKIE, PREVIEW_SEARCH_PARAM } from '@/constants';

const PREVIEW_COOKIE_DURATION_MINUTES = 30;

function getPreviewCookieExpiry(): Date {
    return new Date(Date.now() + PREVIEW_COOKIE_DURATION_MINUTES * 60_000);
}

export function isPreviewActive(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    const hasPreviewCookie = Boolean(Cookies.get(PREVIEW_COOKIE));
    if (hasPreviewCookie) {
        return true;
    }

    const url = new URL(window.location.href);
    const hasPreviewParam = url.searchParams.has(PREVIEW_SEARCH_PARAM);

    if (hasPreviewParam) {
        Cookies.set(PREVIEW_COOKIE, 'true', {
            expires: getPreviewCookieExpiry(),
            sameSite: 'lax',
        });
        return true;
    }

    return false;
}

export function clearPreview(): void {
    if (typeof window === 'undefined') {
        return;
    }

    Cookies.remove(PREVIEW_COOKIE, { sameSite: 'lax' });

    const currentUrl = new URL(window.location.href);

    if (!currentUrl.searchParams.has(PREVIEW_SEARCH_PARAM)) {
        window.location.reload();
        return;
    }

    currentUrl.searchParams.delete(PREVIEW_SEARCH_PARAM);

    window.location.replace(currentUrl.toString());
}
