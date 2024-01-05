import { type UrlGenerator } from '@prezly/theme-kit-nextjs';
import { Route, Router, RoutingAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';

export type AppRouter = ReturnType<typeof configureAppRouter>;
export type AppRoutes = AppRouter['routes'];
export type AppUrlGenerator = UrlGenerator<AppRouter>;
export type AppUrlGeneratorParams = UrlGenerator.Params<AppRouter>;

export const { useRouting: routing } = RoutingAdapter.connect(configureAppRouter, async () => {
    const [locales, defaultLocale] = await Promise.all([app().locales(), app().defaultLocale()]);
    return { defaultLocale, locales };
});

export function configureAppRouter() {
    const route = Route.create;

    return Router.create({
        index: route('/(:localeSlug)', '/:localeSlug'),
        category: route('(/:localeSlug)/category/:slug', '/:localeSlug/category/:slug'),
        media: route('(/:localeSlug)/media', '/:localeSlug/media'),
        mediaGallery: route('(/:localeSlug)/media/album/:uuid', '/:localeSlug/media/album/:uuid'),
        search: route('(/:localeSlug)/search', '/:localeSlug/search'),

        previewStory: route('/s/:uuid', '/:localeSlug/preview/:uuid', {
            check(_, searchParams) {
                return searchParams.has('preview');
            },
            generate(pattern, params) {
                return `${pattern.stringify(params)}?preview` as `/${string}`;
            },
        }),

        secretStory: route('/s/:uuid', '/:localeSlug/secret/:uuid', {
            check(_, searchParams) {
                return !searchParams.has('preview');
            },
        }),

        story: route('/:slug', '/:localeSlug/:slug'),
    });
}
