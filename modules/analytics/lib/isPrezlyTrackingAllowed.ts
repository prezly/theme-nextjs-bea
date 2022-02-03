import type { Newsroom } from '@prezly/sdk';
import { TrackingPolicy } from '@prezly/sdk';

import { isNavigatorTrackingAllowed } from './isNavigatorTrackingAllowed';

/**
 * - TRUE  - user clicked "Allow"
 * - FALSE - user clicked "Disallow" or browser "Do Not Track" is enabled
 * - NULL  - user didn't click anything yet
 */
export function isPrezlyTrackingAllowed(
    consent: boolean | null,
    newsroom: Newsroom,
): boolean | null {
    if (newsroom.tracking_policy === TrackingPolicy.DISABLED) {
        return false;
    }

    const isTrackingAllowed = consent;
    if (isTrackingAllowed !== null) {
        return isTrackingAllowed;
    }

    if (isNavigatorTrackingAllowed() === false) {
        return false; // "Disallow tracking" -- no need to ask consent
    }

    // Both "Allow navigator tracking" and "no preference" require us to ask a consent.
    return null;
}
