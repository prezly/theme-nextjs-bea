import type { ExtendedStory } from '@prezly/sdk';
import { StoryFormatVersion } from '@prezly/sdk';
import { getPrezlyApi } from '@prezly/theme-kit-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import ReactDOMServer from 'react-dom/server';

import SlateFeedRenderer from '@/components/SlateFeedRenderer';

const metadata = {
    title: 'Gijs Lifelog',
    description: 'About www.lifelog.be',
    link: 'https://lifelog.be',
};

function getStoryHtml(story: ExtendedStory): string {
    if (story.format_version === StoryFormatVersion.HTML) {
        return story.content as string;
    }

    if (story.format_version === StoryFormatVersion.SLATEJS) {
        return ReactDOMServer.renderToString(
            <SlateFeedRenderer nodes={JSON.parse(story.content as string)} />,
        );
    }

    return '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(404);
    }

    const { category } = req.query;
    const page = 1;
    const pageSize = 20;
    const localeCode = 'en';
    const api = getPrezlyApi();
    let apiResponse = null;

    if (category) {
        const categoryEntity = await api.getCategoryBySlug(category as string);
        if (categoryEntity) {
            apiResponse = await api.getStoriesFromCategory(categoryEntity, {
                page,
                pageSize,
                include: ['content'],
                localeCode,
            });
        }
    }

    if (!apiResponse) {
        apiResponse = await api.getStories({
            page,
            pageSize,
            include: ['content'],
            localeCode,
        });
    }

    try {
        const postItems = apiResponse.stories
            .map((story) => {
                const url = `https://www.lifelog.be/${story.slug}`;
                const content = getStoryHtml(story as ExtendedStory);
                const safeTitle = story.title.replace('&', '&#x26;').replace('<', '&#x3C;');
                return `<item>
        <title>${safeTitle}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${story.published_at}</pubDate>
        <content:encoded><![CDATA[${content}]]></content:encoded>
      </item>\n\t  `;
            })
            .join('');

        // Add urlSet to entire sitemap string
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
      <channel>
      <title>${metadata.title}</title>
      <description>${metadata.description}</description>
      <link>${metadata.link}</link>
      <lastBuildDate>${apiResponse.stories[0].published_at}</lastBuildDate>
      ${postItems}
    </channel>
</rss>`;

        // set response content header to xml
        res.setHeader('Content-Type', 'text/xml');

        res.status(200).send(sitemap);
    } catch (exception: unknown) {
        if (!(exception instanceof Error)) {
            throw exception;
        }

        res.status(500).json({});
    }
}
