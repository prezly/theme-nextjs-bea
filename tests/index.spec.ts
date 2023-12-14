// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@playwright/test';
import { initContentDeliveryClient } from '@prezly/theme-kit-core/server';

test('homepage loads correctly', async ({ page }) => {
    // Different newsrooms could be loaded depending on the env config, so we need to fetch the data to allow proper content assertions.
    let newsroomName = process.env.TESTS_NEWSROOM_NAME;
    if (!newsroomName) {
        if (process.env.CI) {
            throw new Error(
                '`TESTS_NEWSROOM_NAME` should be set in env variables when running on CI',
            );
        }

        const api = initContentDeliveryClient();
        const newsroom = await api.newsroom();
        newsroomName = newsroom.display_name;
    }

    await page.goto('/');
    await expect(page).toHaveTitle(newsroomName);

    const siteLogo = page.getByRole('heading', { name: newsroomName, exact: true });
    await expect(siteLogo).toBeVisible();
});
