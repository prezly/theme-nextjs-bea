import parseDataUrl from 'parse-data-url';
import type { IncomingMessage } from 'http';
import type { Env } from '../../types';

const decodeJson = (json: string): Record<string, any> => {
    try {
        const decoded = JSON.parse(json);
        if (decoded && typeof decoded === 'object') {
            return decoded;
        }
    } catch {
        // passthru
    }
    return {};
};

const decodeHttpEnv = (header: string): Record<string, any> => {
    if (header.startsWith('data:')) {
        const parsed = parseDataUrl(header);
        if (parsed && parsed.contentType === 'application/json') {
            return decodeJson(parsed.data);
        }
        return {}; // unsupported data-uri
    }
    return decodeJson(header);
};

const getEnvVariables = (req?: IncomingMessage): Env => {
    if (process.browser) {
        throw new Error('"getEnvVariables" should only be used on back-end side.');
    }

    const httpEnvHeader = (process.env.HTTP_ENV_HEADER || '').toLowerCase();

    if (httpEnvHeader && req) {
        const httpEnv = decodeHttpEnv(httpEnvHeader);
        return { ...process.env, ...httpEnv };
    }

    return { ...process.env };
};

export default getEnvVariables;
