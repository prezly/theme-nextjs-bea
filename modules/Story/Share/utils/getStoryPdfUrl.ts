'use server';

import { routing, type Story } from '@prezly/sdk';

const { PREZLY_ACCESS_TOKEN, PREZLY_API_BASEURL } = process.env;

export async function getStoryPdfUrl(uuid: Story['uuid']) {
    return fetch(`${PREZLY_API_BASEURL}${routing.storiesUrl}/${uuid}`, {
        headers: {
            Authorization: `Bearer ${PREZLY_ACCESS_TOKEN}`,
            Accept: 'application/pdf',
        },
        redirect: 'manual',
    }).then((response) => response.headers.get('location'));
}
