import { Sitemap } from '@prezly/theme-kit-nextjs';
import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

import { app, environment, routing } from '@/adapters/server';

const MINUTE = 60;

export const revalidate = 15 * MINUTE;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { generateUrl } = await routing();

    return Sitemap.generate(
        {
            generateUrl,
            categories: app().categories,
            newsroom: app().newsroom,
            locales: app().locales,
            stories: app().allStories,
        },
        {
            baseUrl: retrieveBaseUrl(),
        },
    );
}

export function retrieveBaseUrl() {
    const { NEXT_PUBLIC_BASE_URL } = environment();

    return NEXT_PUBLIC_BASE_URL ?? `https://${headers().get('host')}`;
}
