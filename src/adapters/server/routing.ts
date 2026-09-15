import type { Locale, UrlGenerator } from '@prezly/theme-kit-nextjs';
import { Route, Router, RoutingAdapter } from '@prezly/theme-kit-nextjs/server';

// Imported directly: this module is bundled into the Edge middleware, and the
// utils barrel would pull unrelated Node-only helpers into that bundle.
import { isPossibleStorySlug } from '../../utils/isPossibleStorySlug';

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

export function configureAppRouter({
    resolveStoryLocale,
}: {
    resolveStoryLocale?: (slug: string) => Promise<Locale.Code | undefined>;
} = {}) {
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
            // A segment the API could never have stored as a slug is a 404
            // before any lookup: the middleware rewrites it to the not-found
            // page without calling the story API.
            check({ slug }) {
                return isPossibleStorySlug(slug);
            },
            resolveLocale({ slug }) {
                if (resolveStoryLocale) return resolveStoryLocale(slug);
                return app()
                    .story({ slug })
                    .then((story) => story?.culture.code);
            },
        }),

        feed: route('/feed', '/feed'),
    });
}
