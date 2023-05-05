/* eslint-disable import/no-extraneous-dependencies */
import { playwrightConfig } from '@prezly/theme-kit-nextjs/playwright';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: '.env.local' });

// eslint-disable-next-line import/no-default-export
export default playwrightConfig;
