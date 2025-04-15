import type { UrlGenerator } from '@prezly/theme-kit-nextjs';
import { Route, Router, RoutingAdapter } from '@prezly/theme-kit-nextjs/server';

import { app } from './app';

export type AppRouter = ReturnType<typeof configureAppRouter>;
export type AppRoutes = AppRouter['routes'];
export type AppUrlGenerator = UrlGenerator<AppRouter>;
export type AppUrlGeneratorParams = UrlGenerator.Params<AppRouter>;

export const { useRouting: routing } = RoutingAdapter.connect(configureAppRouter, async () => {
    const [newsroom, locales, defaultLocale] = await Promise.all([
        app().newsroom(),
        app().locales(),
        app().defaultLocale(),
    ]);
    return {
        defaultLocale,
        locales,
        origin: new URL(newsroom.url).origin as `http://${string}` | `https://${string}`,
    };
});

export function configureAppRouter() {
    const route = Route.create;

    return Router.create({
        index: route('/(:localeSlug)', '/:localeCode'),
        category: route('(/:localeSlug)/category/:slug', '/:localeCode/category/:slug'),
        tag: route('(/:localeSlug)/tag/:tag', '/:localeCode/tag/:tag'),
        media: route('(/:localeSlug)/media', '/:localeCode/media'),
        mediaGallery: route('(/:localeSlug)/media/album/:uuid', '/:localeCode/media/album/:uuid'),
        search: route('(/:localeSlug)/search', '/:localeCode/search'),
        privacyPolicy: route('(/:localeSlug)/privacy-policy', '/:localeCode/privacy-policy'),

        previewStory: route('/s/:uuid', '/:localeCode/preview/:uuid', {
            check(_, searchParams) {
                return searchParams.has('preview');
            },
            generate(pattern, params) {
                return `${pattern.stringify(params)}?preview` as `/${string}`;
            },
            resolveLocale({ uuid }) {
                return app()
                    .story({ uuid })
                    .then((story) => story?.culture.code);
            },
        }),

        secretStory: route('/s/:uuid', '/:localeCode/secret/:uuid', {
            check(_, searchParams) {
                return !searchParams.has('preview');
            },
            resolveLocale({ uuid }) {
                return app()
                    .story({ uuid })
                    .then((story) => story?.culture.code);
            },
        }),

        story: route('/:slug', '/:localeCode/:slug', {
            resolveLocale({ slug }) {
                return app()
                    .story({ slug })
                    .then((story) => story?.culture.code);
            },
        }),

        feed: route('/feed', '/feed'),
    });
}
