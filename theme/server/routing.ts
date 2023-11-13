/* eslint-disable @typescript-eslint/no-use-before-define */

import { locale } from '@/theme-kit/locale';
import {
    integrateRouting,
    route,
    router,
    type UrlGenerator,
    type UrlGeneratorParams,
} from '@/theme-kit/server';

import { api } from './api';

export type AppRouter = ReturnType<typeof configureAppRouter>;
export type AppRoutes = AppRouter['routes'];
export type AppUrlGenerator = UrlGenerator<AppRouter>;
export type AppUrlGeneratorParams = UrlGeneratorParams<AppRouter>;

export const { useRouting: routing } = integrateRouting(configureAppRouter, async () => {
    const { contentDelivery } = api();

    return {
        locales: await contentDelivery.locales(),
        defaultLocale: await contentDelivery.defaultLocale(),
        activeLocale: locale().code,
    };
});

export function configureAppRouter() {
    const { contentDelivery } = api();

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
        },
        {
            languages: () => contentDelivery.languages(),
        },
    );
}
