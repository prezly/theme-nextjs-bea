import { Analytics } from '@prezly/analytics-nextjs';

import { isGalleryPreviewPath } from './galleryPreview';

export const trackingAnalytics = new Analytics();

function isGalleryPreview() {
    return typeof window !== 'undefined' && isGalleryPreviewPath(window.location.pathname);
}

// Layouts persist across client navigation. The application facade also guards
// delayed page views and media interactions after leaving a public page.
export function createAnalyticsFacade(
    client: Pick<Analytics, 'init' | 'setMeta' | 'setConsent' | 'page' | 'track'>,
    enabled: () => boolean,
) {
    return {
        init: client.init,
        setMeta: client.setMeta,
        setConsent: client.setConsent,
        page: (...args: Parameters<Analytics['page']>) =>
            enabled() ? client.page(...args) : Promise.resolve(),
        track: (...args: Parameters<Analytics['track']>) =>
            enabled() ? client.track(...args) : Promise.resolve(),
    };
}

export const analytics = createAnalyticsFacade(trackingAnalytics, () => !isGalleryPreview());
