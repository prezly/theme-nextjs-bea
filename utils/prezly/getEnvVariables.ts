import type { IncomingMessage } from 'http';
import type { Env } from '../../types';

const getEnvVariables = (req?: IncomingMessage): Env | null => {
    if (process.browser) {
        throw new Error('"getEnvVariables" should only be used on back-end side.');
    }

    const envHeader = (process.env.HTTP_ENV_HEADER || '').toLowerCase();

    if (!envHeader || !req) {
        return process.env;
    }

    try {
        const envJson = req.headers[envHeader] as string;
        return JSON.parse(envJson);
    } catch {
        return process.env as any;
    }
};

export default getEnvVariables;
