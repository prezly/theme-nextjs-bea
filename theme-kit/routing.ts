import { api } from './api';
import { createRouter, route } from './router';

export function configureAppRouter() {
    const { contentDelivery } = api();

    return createRouter([
        route('/(:localeSlug)', '/:localeCode'),
        route('(/:localeSlug)/category/:slug', '/:localeCode/category/:slug'),
        route('(/:localeSlug)/media', '/:localeCode/media'),
        route('(/:localeSlug)/media/album/:uuid', '/:localeCode/media/album/:uuid'),
        route('(/:localeSlug)/search', '/:localeCode/search'),

        route('/s/:uuid', '/:localeCode/preview/:uuid', {
            check(_, searchParams) {
                return searchParams.has('preview');
            },
            async resolveImplicitLocale({ uuid }) {
                const story = await contentDelivery.story({ uuid });
                return story?.culture.code;
            },
        }),

        route('/s/:uuid', '/:localeCode/secret/:uuid', {
            check(_, searchParams) {
                return !searchParams.has('preview');
            },
            async resolveImplicitLocale({ uuid }) {
                const story = await contentDelivery.story({ uuid });
                return story?.culture.code;
            },
        }),

        route('/:slug', '/:localeCode/:slug', {
            async resolveImplicitLocale({ slug }) {
                const story = await contentDelivery.story({ slug });
                return story?.culture.code;
            },
        }),
    ]);
}
