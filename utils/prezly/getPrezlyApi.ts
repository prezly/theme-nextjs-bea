import type { IncomingMessage } from 'http';
import PrezlyApi from 'utils/prezly/api';
import getEnvVariables from './getEnvVariables';

const getPrezlyApi = (req?: IncomingMessage): PrezlyApi => {
    if (process.browser) {
        throw new Error('"getPrezlyApi" should only be used on back-end side.');
    }

    // `getEnvVariables` handles both cases for envs parsing - .env and request headers
    const { PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID } = getEnvVariables(req);

    if (!PREZLY_ACCESS_TOKEN) {
        throw new Error('"PREZLY_ACCESS_TOKEN" is not set in env variables.');
    }

    if (!PREZLY_NEWSROOM_UUID) {
        throw new Error('"PREZLY_NEWSROOM_UUID" is not set in env variables.');
    }

    return new PrezlyApi(PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID);
};

export default getPrezlyApi;
