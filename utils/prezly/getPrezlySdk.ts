import type { IncomingMessage } from 'http';
import PrezlySdk from '@prezly/sdk';
import type { Env } from '../../types';
import getEnvVariables from './getEnvVariables';

const getPrezlySdk = (req: IncomingMessage, env: Env = getEnvVariables(req)!): PrezlySdk => {
    if (process.browser) {
        throw new Error('"getPrezlySdk" should only be used on back-end side.');
    }

    return new PrezlySdk({
        accessToken: env.PREZLY_ACCESS_TOKEN,
    });
};

export default getPrezlySdk;
