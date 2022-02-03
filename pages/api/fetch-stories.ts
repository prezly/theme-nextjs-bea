import { getPrezlyApi } from '@prezly/theme-kit-nextjs';
import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

async function fetchStories(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405);
        return;
    }

    const { page, pageSize, category, include, localeCode } = req.body;

    try {
        const api = getPrezlyApi(req);

        const { stories } = await (category
            ? api.getStoriesFromCategory(category, { page, pageSize, include, localeCode })
            : api.getStories({ page, pageSize, include, localeCode }));

        res.status(200).json({ stories });
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
        });
    }
}

export default withSentry(fetchStories);
