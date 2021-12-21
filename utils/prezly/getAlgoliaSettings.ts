import type { IncomingMessage } from 'http';

import getEnvVariables from './getEnvVariables';

export interface AlgoliaSettings {
    ALGOLIA_API_KEY: string;
    ALGOLIA_APP_ID: string;
    ALGOLIA_INDEX: string;
}

const getAlgoliaSettings = (req?: IncomingMessage): AlgoliaSettings => {
    if (process.browser) {
        throw new Error('"getAlgoliaSettings" should only be used on back-end side.');
    }

    // `getEnvVariables` handles both cases for envs parsing - .env and request headers
    const {
        ALGOLIA_API_KEY = '',
        ALGOLIA_APP_ID = 'UI4CNRAHQB',
        ALGOLIA_INDEX = 'public_stories_prod',
    } = getEnvVariables(req);

    if (!ALGOLIA_API_KEY) {
        // eslint-disable-next-line no-console
        console.error('"ALGOLIA_API_KEY" is not set in env variables. Search will not be enabled');
    }

    return {
        ALGOLIA_API_KEY,
        ALGOLIA_APP_ID,
        ALGOLIA_INDEX,
    };
};

export default getAlgoliaSettings;
