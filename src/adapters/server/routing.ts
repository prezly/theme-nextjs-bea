import type { Locale, UrlGenerator } from '@prezly/theme-kit-nextjs';
import { Route, Router, RoutingAdapter } from '@prezly/theme-kit-nextjs/server';

// Imported directly: this module is bundled into the Edge middleware, and the
// utils barrel would pull unrelated Node-only helpers into that bundle.
import {
    applyBasePath,
    applyBasePathAbsolute,
    createToLocaleSlug,
    isReverseProxyConfigured,
    parseBasePathConfig,
} from '../../utils/basePath';
import { isPossibleStorySlug } from '../../utils/isPossibleStorySlug';

import { app } from './app';
import { environment } from './environment';

export type AppRouter = ReturnType<typeof configureAppRouter>;
export type AppRoutes = AppRouter['routes'];
export type AppUrlGenerator = UrlGenerator<AppRouter>;
export type AppUrlGeneratorParams = UrlGenerator.Params<AppRouter>;

const { useRouting: baseRouting } = RoutingAdapter.connect(configureAppRouter, async () => {
    const [newsroom, locales, defaultLocale] = await Promise.all([
        app().newsroom(),
        app().locales(),
        app().defaultLocale(),
    ]);
    const { localeSlugFormat } = parseBasePathConfig(environment());
    const toLocaleSlug = createToLocaleSlug(localeSlugFormat) as
        | ((code: Locale.Code) => Locale.UrlSlug)
        | undefined;
    return {
        defaultLocale,
        locales,
        origin: new URL(newsroom.url).origin as `http://${string}` | `https://${string}`,
        toLocaleSlug,
    };
});

export async function routing() {
    const [base, newsroom] = await Promise.all([baseRouting(), app().newsroom()]);
    const config = {
        ...parseBasePathConfig(environment()),
        backendOrigin: new URL(newsroom.url).origin,
    };

    const generateUrl: typeof base.generateUrl = ((routeName: string, ...rest: unknown[]) => {
        const url = (base.generateUrl as (name: string, ...args: unknown[]) => `/${string}`)(
            routeName,
            ...rest,
        );
        const params = rest[0] as { localeCode?: string } | undefined;
        return applyBasePath(url, config, params?.localeCode) as `/${string}`;
    }) as typeof base.generateUrl;

    const generateAbsoluteUrl: typeof base.generateAbsoluteUrl = ((
        routeName: string,
        ...rest: unknown[]
    ) => {
        const url = (
            base.generateAbsoluteUrl as (
                name: string,
                ...args: unknown[]
            ) => `http://${string}` | `https://${string}`
        )(routeName, ...rest);
        const params = rest[0] as { localeCode?: string } | undefined;
        return applyBasePathAbsolute(url, config, params?.localeCode) as
            | `http://${string}`
            | `https://${string}`;
    }) as typeof base.generateAbsoluteUrl;

    return {
        ...base,
        basePathConfig: config,
        generateUrl,
        generateAbsoluteUrl,
    };
}

/**
 * The theme's own reverse-proxy-correct absolute URL for the newsroom root, for
 * consumers that would otherwise use the backend-owned `newsroom.url` (which
 * carries neither `THEME_BASE_PATH` nor `THEME_LOCALE_SUBDIR`).
 *
 * Returns `undefined` when reverse-proxy support is unconfigured, so callers fall
 * back to `newsroom.url`.
 */
export async function generateNewsroomUrl(localeCode: Locale.Code): Promise<string | undefined> {
    const { basePathConfig, generateAbsoluteUrl } = await routing();
    if (!isReverseProxyConfigured(basePathConfig)) return undefined;
    return generateAbsoluteUrl('index', { localeCode });
}

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
