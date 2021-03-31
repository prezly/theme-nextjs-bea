import React from 'react';
import { getPrezlyApi } from '@/utils/prezly';
import { Category, Story } from '@prezly/sdk/dist/types';
import { NextPageContext } from 'next';

const createSitemap = (
    url: string,
    stories: Array<Story>,
    categories: Array<Category>,
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${stories
        .map(({ slug }) => `
                <url>
                    <loc>${`${url}/${slug}`}</loc>
                </url>
            `)
        .join('')}
        ${categories
        .map((category) => {
            const translations = Object.values(category.i18n);
            const slugs = translations
                .map((t) => (t.slug || ''))
                .filter(Boolean)
                .reduce((arr, item) => (arr.includes(item) ? [...arr] : [...arr, item]),
                    [] as string[]); // unique slugs

            return slugs.map((slug) => `
                <url>
                    <loc>${`${url}/category/${slug}`}</loc>
                </url>
                 `).join('');
        }).join('')}
    </urlset>
`;

class Sitemap extends React.Component {
    static async getInitialProps(ctx: NextPageContext) {
        const { res, req } = ctx;

        if (!req || !res) { // client side
            return null;
        }

        const url = req.headers.host || '/';

        const api = getPrezlyApi(req);
        const stories = await api.getAllStoriesNoLimit();
        const categories = await api.getCategories();

        res.setHeader('Content-Type', 'text/xml');
        res.write(createSitemap(url, stories, categories));
        res.end();

        return null;
    }
}

export default Sitemap;
