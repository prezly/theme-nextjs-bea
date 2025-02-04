'use server';

import type { Story } from '@prezly/sdk';

const { PREZLY_ACCESS_TOKEN, PREZLY_API_BASEURL } = process.env;

const STORIES_ENDPOINT = `${PREZLY_API_BASEURL}/v2/stories`;

export async function getStoryPdfUrl(uuid: Story['uuid']) {
    return fetch(`${STORIES_ENDPOINT}/${uuid}`, {
        headers: {
            Authorization: `Bearer ${PREZLY_ACCESS_TOKEN}`,
            Accept: 'application/pdf',
        },
        redirect: 'manual',
    }).then((response) => response.headers.get('location'));
}
