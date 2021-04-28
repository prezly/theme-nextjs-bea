import { getPrezlyApi } from '@/utils/prezly';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function fetchStories(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405);
        return;
    }

    const { page, pageSize, category } = req.body;

    try {
        const api = getPrezlyApi(req);

        const { stories } = await (category
            ? api.getStoriesFromCategory(category, { page, pageSize })
            : api.getStories({ page, pageSize })
        );

        res.status(200).json({ stories });
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
}
