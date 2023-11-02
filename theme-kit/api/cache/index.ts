import { createFetch } from './fetch';

export const fetch = createFetch({
    ttl: process.env.NODE_ENV === 'production' ? 10000 : Infinity,
});
