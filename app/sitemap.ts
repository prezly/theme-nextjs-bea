/* eslint-disable @typescript-eslint/no-use-before-define */
import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

import { api, app, environment, routing } from '@/adapters/server';

export const revalidate = 900; // 15 minutes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { NEXT_PUBLIC_BASE_URL } = environment();
    const { contentDelivery } = api();
    const { generateUrl } = await routing();

    const baseUrl = NEXT_PUBLIC_BASE_URL ?? `https://${headers().get('host')}`;

    const generateRootUrls = async () => {
        const defaultLanguage = await contentDelivery.defaultLanguage();
        return generateUrl('index', { localeCode: defaultLanguage.code });
    };

    const generateStoryUrls = async () => {
        const stories = await contentDelivery.allStories();
        return stories.map((story) => generateUrl('story', { slug: story.slug }));
    };

    const generateCategoryUrls = async () => {
        const defaultLang = await contentDelivery.defaultLanguage();
        const translatedCategories = await app().translatedCategories(defaultLang.code);
        return translatedCategories.map(({ locale, slug }) =>
            generateUrl('category', { slug, localeCode: locale }),
        );
    };

    const paths = await Promise.all([
        generateRootUrls(),
        generateStoryUrls(),
        generateCategoryUrls(),
    ]);

    return paths.flat().map((path) => ({
        url: [baseUrl, path].join(''),
        changeFrequency: guessFrequency(path),
        priority: guessPriority(path),
    }));
}

function guessFrequency(path: `/${string}`) {
    if (path === '/') return 'daily';
    return 'weekly';
}

function guessPriority(path: `/${string}`) {
    if (path === '/') return 0.9;
    if (path.includes('/category/')) return 0.8;
    return 0.7;
}
