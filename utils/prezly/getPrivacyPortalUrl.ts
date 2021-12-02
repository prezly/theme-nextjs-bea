import { Newsroom } from '@prezly/sdk';

import { toSlug } from '../locale';

type PrivacyPortalUrlOptions = { email?: string; action?: 'subscribe' | 'unsubscribe' };

export default function getPrivacyPortalUrl(
    newsroom: Newsroom,
    locale: string,
    options?: PrivacyPortalUrlOptions,
) {
    const { email, action = 'subscribe' } = options || {};

    const url = new URL(
        `/${toSlug(locale)}/newsroom/${newsroom.uuid}/${action}`,
        'https://privacy.prezly.com',
    );
    if (email) {
        url.searchParams.append('email', email);
    }
    return url.toString();
}
