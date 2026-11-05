import { ApiError, createPrezlyClient, type NewsroomGallery } from '@prezly/sdk';
import { headers } from 'next/headers';
import { cache } from 'react';

import { environment } from './environment';

/** Request-local deduplication only; preview content never enters the gallery cache. */
export const galleryPreview = cache(async (token: string): Promise<NewsroomGallery | null> => {
    const env = environment(await headers());
    const client = createPrezlyClient({
        accessToken: env.PREZLY_ACCESS_TOKEN,
        baseUrl: env.PREZLY_API_BASEURL,
        fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    });

    return fetchGalleryPreview(client, env.PREZLY_NEWSROOM_UUID, token);
});

export async function fetchGalleryPreview(
    client: ReturnType<typeof createPrezlyClient>,
    newsroom: string,
    token: string,
): Promise<NewsroomGallery | null> {
    try {
        const { gallery } = await client.api.get<{ gallery: NewsroomGallery }>(
            `/v2/newsrooms/${encodeURIComponent(newsroom)}/galleries/preview/${encodeURIComponent(token)}`,
        );
        return gallery;
    } catch (error) {
        if (error instanceof ApiError && [403, 404, 410].includes(error.status)) return null;
        throw error;
    }
}
