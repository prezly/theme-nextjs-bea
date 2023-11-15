/* eslint-disable import/no-extraneous-dependencies */
import { createPlaywrightConfig } from '@prezly/theme-kit-nextjs/playwright';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: '.env.local' });

// eslint-disable-next-line import/no-default-export
export default createPlaywrightConfig({
    baseUrl: process.env.TESTS_BASE_URL || 'http://localhost:3000',
    testDir: './tests',
    ci: Boolean(process.env.CI),
});
