'use server';

import { routing, type Story } from '@prezly/sdk';
import { headers } from 'next/headers';

import { environment } from '@/adapters/server';

const PREZLY_API_URL = 'https://api.prezly.com';

// Canonical UUID shape only. The argument comes from the client, so anything
// else must not reach the API URL (path traversal, query strings, etc.).
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getStoryPdfUrl(uuid: Story['uuid']) {
    if (typeof uuid !== 'string' || !UUID_PATTERN.test(uuid)) {
        return null;
    }

    const requestHeaders = await headers();
    const env = environment(requestHeaders);

    const { PREZLY_ACCESS_TOKEN, PREZLY_API_BASEURL = PREZLY_API_URL } = env;
    const STORIES_ENDPOINT = `${PREZLY_API_BASEURL}${routing.storiesUrl}`;

    return fetch(`${STORIES_ENDPOINT}/${uuid}`, {
        headers: {
            Authorization: `Bearer ${PREZLY_ACCESS_TOKEN}`,
            Accept: 'application/pdf',
        },
        redirect: 'manual',
    }).then((response) => response.headers.get('location'));
}
