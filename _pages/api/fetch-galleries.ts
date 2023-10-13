import { fetchGalleries } from '@prezly/theme-kit-nextjs/server';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';

export default wrapApiHandlerWithSentry(fetchGalleries, '/api/fetch-galleries');
