import { Newsroom } from '@prezly/sdk';

type PrivacyPortalUrlOptions = { email?: string; action?: 'subscribe' | 'unsubscribe' };

export default function getPrivacyPortalUrl(
    newsroom: Newsroom | null,
    options?: PrivacyPortalUrlOptions,
) {
    const { email, action = 'subscribe' } = options || {};

    if (!newsroom) {
        return '';
    }

    return `https://privacy.prezly.com/newsroom/${newsroom.uuid}/${action}${
        email ? `?email=${email}` : ''
    }`;
}
