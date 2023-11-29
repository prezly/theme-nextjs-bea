import { createPrezlyClient } from '@prezly/sdk';
import { ContentDelivery, Environment } from '@prezly/theme-kit-nextjs';
import type { Handler } from 'express';

export function defineEnvironment<T>(validate: (vars: Record<string, unknown>) => T): Handler {
    return (req, res, next) => {
        const variables = Environment.combine(
            process.env,
            process.env.HTTP_ENV_HEADER ? req.header(process.env.HTTP_ENV_HEADER) : undefined,
        );

        res.locals.env = validate(variables) as any;
        next();
    };
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

        res.locals.contentDelivery = contentDelivery;

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

        next();
    };
}
