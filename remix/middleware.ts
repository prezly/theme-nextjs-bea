import { createPrezlyClient } from '@prezly/sdk';
import { ContentDelivery, Environment, IntlMiddleware } from '@prezly/theme-kit-nextjs';
import type { Handler } from 'express';
import { stringify } from 'qs'; // eslint-disable-line import/no-extraneous-dependencies

import { createAppHelper } from './app-helper';
import { configureAppRouter } from './routing';
import { ThemeSettings } from './theme-settings';

export function defineAppEnvironment<T>(validate: (vars: Record<string, unknown>) => T): Handler {
    return (req, res, next) => {
        const variables = Environment.combine(
            process.env,
            process.env.HTTP_ENV_HEADER ? req.header(process.env.HTTP_ENV_HEADER) : undefined,
        );

        res.locals.env = validate(variables) as any;
        next();
    };
}

export function defineContentDeliveryClient({
    cache = true,
    ...config
}: ContentDelivery.Options = {}): Handler {
    return (_req, res, next) => {
        const { env } = res.locals;

        const client = createPrezlyClient({
            accessToken: env.PREZLY_ACCESS_TOKEN,
            baseUrl: env.PREZLY_API_BASEURL || undefined,
            headers: {
                'X-Newsroom-Uuid': env.PREZLY_NEWSROOM_UUID,
            },
        });
        const contentDelivery = ContentDelivery.createClient(
            client,
            env.PREZLY_NEWSROOM_UUID,
            env.PREZLY_THEME_UUID,
            { cache, ...config },
        );

        res.locals.contentDelivery = contentDelivery;

        next();
    };
}

export function defineNewsroomContext(): Handler {
    return async (_req, res, next) => {
        const { contentDelivery } = res.locals;

        const [newsroom, languages, themeSettings] = await Promise.all([
            contentDelivery.newsroom(),
            contentDelivery.languages(),
            contentDelivery.themeSettings(),
        ]);

        res.locals.newsroom = newsroom;
        res.locals.themeSettings = { ...ThemeSettings.DEFAULTS, ...themeSettings };

        res.locals.languages = languages;
        res.locals.defaultLanguage = languages.find((lang) => lang.is_default) ?? languages[0];

        res.locals.locales = languages.map((lang) => lang.code);
        res.locals.defaultLocale = res.locals.defaultLanguage.code;

        next();
    };
}

export function defineAppRouting(): Handler {
    return (_req, res, next) => {
        const { contentDelivery } = res.locals;

        res.locals.routing = configureAppRouter(contentDelivery);

        next();
    };
}

export function handleIntlRouting(): Handler {
    return async (req, res, next) => {
        const action = await IntlMiddleware.handle(
            res.locals.routing,
            req.path,
            new URLSearchParams(stringify(req.query)),
            {
                locales: res.locals.locales,
                defaultLocale: res.locals.defaultLocale,
            },
        );

        if ('redirect' in action) {
            return res.redirect(action.redirect);
        }

        if ('rewrite' in action) {
            res.locals.locale = action.locale;
            req.url = action.rewrite;
            return next();
        }

        res.locals.locale = action.locale;
        req.url = `/_errors/404`;
    };
}

export function defineAppHelper(): Handler {
    return (_, res, next) => {
        res.locals.app = createAppHelper(res.locals.contentDelivery, res.locals.locale);

        next();
    };
}
