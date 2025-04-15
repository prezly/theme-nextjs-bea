'use server';

import { routing, type Story } from '@prezly/sdk';
import { headers } from 'next/headers';

import { environment } from '@/adapters/server';

const PREZLY_API_URL = 'https://api.prezly.com';

export async function getStoryPdfUrl(uuid: Story['uuid']) {
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
