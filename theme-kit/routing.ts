import { getShortestLocaleSlug } from '@prezly/theme-kit-core';

import { api } from './api';
import { locale } from './locale';
import type { UrlGenerator } from './router';
import { createRouter, route } from './router';

export function configureAppRouter() {
    const { contentDelivery } = api();

    return createRouter({
        index: route('/(:localeSlug)', '/:localeCode'),
        category: route('(/:localeSlug)/category/:slug', '/:localeCode/category/:slug'),
        media: route('(/:localeSlug)/media', '/:localeCode/media'),
        mediaAlbum: route('(/:localeSlug)/media/album/:uuid', '/:localeCode/media/album/:uuid'),
        search: route('(/:localeSlug)/search', '/:localeCode/search'),

        previewStory: route('/s/:uuid', '/:localeCode/preview/:uuid', {
            check(_, searchParams) {
                return searchParams.has('preview');
            },
            async resolveImplicitLocale({ uuid }) {
                const story = await contentDelivery.story({ uuid });
                return story?.culture.code;
            },
        }),

        secretStory: route('/s/:uuid', '/:localeCode/secret/:uuid', {
            check(_, searchParams) {
                return !searchParams.has('preview');
            },
            async resolveImplicitLocale({ uuid }) {
                const story = await contentDelivery.story({ uuid });
                return story?.culture.code;
            },
        }),

        story: route('/:slug', '/:localeCode/:slug', {
            async resolveImplicitLocale({ slug }) {
                const story = await contentDelivery.story({ slug });
                return story?.culture.code;
            },
        }),
    });
}

export async function routing() {
    const router = configureAppRouter();

    const languages = await api().contentDelivery.languages();

    type RouteName = keyof (typeof router)['routes'];

    function generateUrl(routeName: RouteName, params = {}) {
        const localeCode = (params as any).localeCode ?? locale().code;
        const localeSlug = getShortestLocaleSlug(languages, localeCode) || undefined;

        return router.generate(routeName, { localeSlug, ...params });
    }

    return { generateUrl: generateUrl as UrlGenerator<typeof router> };
}
