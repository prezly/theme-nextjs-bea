import { app } from '@/adapters/server';
import { createGalleriesApiHandler } from '../../../src/adapters/server/public-list-api';

export const GET = createGalleriesApiHandler(app);
