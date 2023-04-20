import { fetchStories } from '@prezly/theme-kit-nextjs';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';

export default wrapApiHandlerWithSentry(fetchStories, '/api/fetch-stories');
