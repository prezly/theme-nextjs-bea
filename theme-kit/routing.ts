import { api } from './api';
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

export function routing() {
    const router = configureAppRouter();

    return {
        generateUrl: router.generate,
    };
}
