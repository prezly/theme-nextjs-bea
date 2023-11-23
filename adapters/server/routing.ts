import {
    route,
    router,
    RoutingAdapter,
    type UrlGenerator,
    type UrlGeneratorParams,
} from '@prezly/theme-kit-nextjs/server';

import { app } from './app';
import { locale } from './locale';

export type AppRouter = ReturnType<typeof configureAppRouter>;
export type AppRoutes = AppRouter['routes'];
export type AppUrlGenerator = UrlGenerator<AppRouter>;
export type AppUrlGeneratorParams = UrlGeneratorParams<AppRouter>;

export const { useRouting: routing } = RoutingAdapter.connect(configureAppRouter, async () => {
    const { locales, defaultLocale } = app();

    return {
        locales: await locales(),
        defaultLocale: await defaultLocale(),
        activeLocale: locale(),
    };
});

export function configureAppRouter() {
    return router(
        {
            index: route('/(:localeSlug)', '/:localeCode'),
            category: route('(/:localeSlug)/category/:slug', '/:localeCode/category/:slug'),
            media: route('(/:localeSlug)/media', '/:localeCode/media'),
            mediaAlbum: route('(/:localeSlug)/media/album/:uuid', '/:localeCode/media/album/:uuid'),
            search: route('(/:localeSlug)/search', '/:localeCode/search'),

            previewStory: route('/s/:uuid', '/:localeCode/preview/:uuid', {
                check(_, searchParams) {
                    return searchParams.has('preview');
                },
                generate(pattern, params) {
                    return `${pattern.stringify(params)}?preview` as `/${string}`;
                },
                async resolveImplicitLocale({ uuid }) {
                    const story = await app().story({ uuid });
                    return story?.culture.code;
                },
            }),

            secretStory: route('/s/:uuid', '/:localeCode/secret/:uuid', {
                check(_, searchParams) {
                    return !searchParams.has('preview');
                },
                async resolveImplicitLocale({ uuid }) {
                    const story = await app().story({ uuid });
                    return story?.culture.code;
                },
            }),

            story: route('/:slug', '/:localeCode/:slug', {
                async resolveImplicitLocale({ slug }) {
                    const story = await app().story({ slug });
                    return story?.culture.code;
                },
            }),
        },
        {
            languages: () => app().languages(),
        },
    );
}
