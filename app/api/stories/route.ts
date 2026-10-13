import { app } from '@/adapters/server';
import { createStoriesApiHandler } from '../../../src/adapters/server/public-list-api';

export const GET = createStoriesApiHandler(app);
