import { Environment } from '@prezly/theme-kit-nextjs';
import type { Handler } from 'express';

export function defineEnvironment<T>(validate: (vars: Record<string, unknown>) => T): Handler {
    return (req, res, next) => {
        const variables = Environment.combine(
            process.env,
            process.env.HTTP_ENV_HEADER ? req.header(process.env.HTTP_ENV_HEADER) : undefined,
        );

        res.locals.env = validate(variables);
        next();
    };
}
