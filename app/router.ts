import 'server-only';

import { api, createRouter, route } from '@/theme-kit';

export default function createAppRouter() {
    const { contentDelivery } = api();

    return createRouter([
        route('/(:localeSlug)', '/:locale'),
        route('(/:localeSlug)/category/:slug', '/:locale/category/:slug'),
        route('(/:localeSlug)/media', '/:locale/media'),
        route('(/:localeSlug)/media/album/:uuid', '/:locale/media/album/:uuid'),
        route('(/:localeSlug)/search', '/:locale/search'),

        route('/s/:uuid', '/:locale/s/:uuid', {
            async resolveImplicitLocale({ uuid }) {
                const story = await contentDelivery.story({ uuid });
                return story?.culture.code;
            },
        }),

        route('/:slug', '/:locale/:slug', {
            async resolveImplicitLocale({ slug }) {
                const story = await contentDelivery.story({ slug });
                return story?.culture.code;
            },
        }),
    ]);
}
