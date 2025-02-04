'use server';

import { createPrezlyClient, routing, type Story } from '@prezly/sdk';

const prezlyClient = createPrezlyClient({
    accessToken: process.env.PREZLY_ACCESS_TOKEN!,
    baseUrl: process.env.PREZLY_API_BASEURL!,
});

export async function getStoryPdfUrl(uuid: Story['uuid']) {
    prezlyClient.api
        .get(`${routing.storiesUrl}/${uuid}`, {
            headers: {
                Accept: 'application/pdf',
            },
        })
        .then(console.log)
        .catch(console.log);

    // TODO: return a proper PDF url
    return '';
}
