import { app, environment } from '@/adapters/server';
import { createHubStoriesApiHandler } from '../../../src/adapters/server/public-list-api';

export const GET = createHubStoriesApiHandler(
    app,
    (headers) => environment(headers).PREZLY_NEWSROOM_UUID,
);
