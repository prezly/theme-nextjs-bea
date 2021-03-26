import type { IncomingMessage } from 'http';
import type { Env } from '../../types';

const getEnvVariables = (req?: IncomingMessage): Env => {
    if (process.browser) {
        throw new Error('"getEnvVariables" should only be used on back-end side.');
    }

    const envHeader = (process.env.HTTP_ENV_HEADER || '').toLowerCase();

    if (envHeader && req) {
        try {
            const envJson = req.headers[envHeader] as string;
            return { ...process.env, ...JSON.parse(envJson) };
        } catch {
            // do nothing
        }
    }

    return { ...process.env };
};

export default getEnvVariables;
