// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@playwright/test';
import { createPrezlyClient } from '@prezly/sdk';
import { ContentDelivery } from '@prezly/theme-kit-nextjs';

test('homepage loads correctly', async ({ page }) => {
    // Different newsrooms could be loaded depending on the env config, so we need to fetch the data to allow proper content assertions.
    let newsroomName = process.env.TESTS_NEWSROOM_NAME;
    if (!newsroomName) {
        if (process.env.CI) {
            throw new Error(
                '`TESTS_NEWSROOM_NAME` should be set in env variables when running on CI',
            );
        }

        const client = ContentDelivery.createClient(
            createPrezlyClient({
                accessToken: process.env.PREZLY_ACCESS_TOKEN!,
                baseUrl: process.env.PREZLY_API_BASEURL!,
            }),
            process.env.PREZLY_NEWSROOM_UUID!,
            process.env.PREZLY_THEME_UUID,
        );
        const newsroom = await client.newsroom();
        newsroomName = newsroom.display_name;
    }

    await page.goto('/');
    await expect(page).toHaveTitle(newsroomName);

    const siteLogo = page.getByRole('heading', { name: newsroomName, exact: true });
    await expect(siteLogo).toBeVisible();
});
