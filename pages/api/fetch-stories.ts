import { fetchStories } from '@prezly/theme-kit-nextjs';
import { withSentry } from '@sentry/nextjs';

export default withSentry(fetchStories);
