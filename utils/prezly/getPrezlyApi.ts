import type { IncomingMessage } from 'http';
import PrezlyApi from 'utils/prezly/api';
import type { Env } from '../../types';
import getEnvVariables from './getEnvVariables';

const getPrezlyApi = (req: IncomingMessage, env: Env = getEnvVariables(req)!): PrezlyApi => {
    if (process.browser) {
        throw new Error('"getPrezlySdk" should only be used on back-end side.');
    }

    return new PrezlyApi(env.PREZLY_ACCESS_TOKEN, parseInt(env.PREZLY_NEWSROOM_ID));
};

export default getPrezlyApi;
