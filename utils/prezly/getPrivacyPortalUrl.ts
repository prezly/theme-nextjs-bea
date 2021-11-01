import { Newsroom } from '@prezly/sdk';

import { convertToBrowserFormat } from '../localeTransform';

type PrivacyPortalUrlOptions = { email?: string; action?: 'subscribe' | 'unsubscribe' };

export default function getPrivacyPortalUrl(
    newsroom: Newsroom | null,
    locale: string,
    options?: PrivacyPortalUrlOptions,
) {
    const { email, action = 'subscribe' } = options || {};

    if (!newsroom) {
        return '';
    }

    const url = new URL(
        `/${convertToBrowserFormat(locale)}/newsroom/${newsroom.uuid}/${action}`,
        'https://privacy.prezly.com',
    );
    if (email) {
        url.searchParams.append('email', email);
    }
    return url.toString();
}
