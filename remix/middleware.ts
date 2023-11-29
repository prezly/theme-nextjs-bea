import { createPrezlyClient } from '@prezly/sdk';
import { ContentDelivery, Environment, IntlMiddleware } from '@prezly/theme-kit-nextjs';
import type { Handler } from 'express';
import { stringify } from 'qs'; // eslint-disable-line import/no-extraneous-dependencies

import { configureAppRouter } from './routing';
import type { ContentDeliveryClient as Client } from './types';

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

export function cache(client: Client): Client {
    const cachedCalls = new Map<string, any>();
    const pendingCalls = new Map<string, Promise<any>>();

    return new Proxy<Client>(client, {
        get(target: Client, p: string | symbol): any {
            const method = target[p as keyof Client] as unknown;

            if (typeof method !== 'function') {
                return method;
            }

            return async (...args: Parameters<Client[keyof Client]>) => {
                const key = JSON.stringify(args);

                const cached = await cachedCalls.get(key);
                if (cached) return cached;

                const pending = pendingCalls.get(key);
                if (pending) return pending;

                const promise = method(...args);

                pendingCalls.set(key, promise);

                const value = await promise;

                cachedCalls.set(key, value);
                pendingCalls.delete(key);

                return value;
            };
        },
    });
}

export function defineContentDeliveryClient(config?: ContentDelivery.Options): Handler {
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
            config,
        );

        res.locals.contentDelivery = cache(contentDelivery);

        next();
    };
}

export function defineNewsroomContext(): Handler {
    return async (_req, res, next) => {
        const { contentDelivery } = res.locals;

        const [newsroom, languages] = await Promise.all([
            contentDelivery.newsroom(),
            contentDelivery.languages(),
        ]);

        res.locals.newsroom = newsroom;
        res.locals.languages = languages;
        res.locals.defaultLanguage = languages.find((lang) => lang.is_default) ?? languages[0];
        res.locals.locales = languages.map((lang) => lang.code);
        res.locals.defaultLocale = res.locals.defaultLanguage.code;

        next();
    };
}

export function defineAppRouting(): Handler {
    return async (_req, res, next) => {
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
            req.path = action.rewrite;
            res.locals.locale = action.locale;
            next();
        }

        req.path = '/_errors/404';
        res.locals.locale = action.locale;

        next();
    };
}
