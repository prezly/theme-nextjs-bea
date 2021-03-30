import React from 'react';
import globby from 'globby';
import { getPrezlyApi } from '@/utils/prezly';
import { Category, Story } from '@prezly/sdk/dist/types';
import { NextPageContext } from 'next';

const createSitemap = (
    url: string,
    paths:Array<string>,
    stories: Array<Story>,
    categories: Array<Category>,
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${paths
        .map((p) => p.replace(/^pages\//, '')) // get rid of /pages
        .map((p) => p.replace(/\.(tsx|ts)$/, '')) // get rid of file extension
        .map((path) => `
                <url>
                    <loc>${`${url}/${path === 'index' ? '' : path}`}</loc>
                </url>
            `)
        .join('')}
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

        const paths = await globby([
            'pages/**/*{.tsx,.ts}',
            '!pages/**/[*', // ignore dynamic paths
            '!pages/_*.js', // ignore nextjs special paths
            '!pages/api', // ignore api routes
        ]);

        const url = req.headers.host || '/';

        const api = getPrezlyApi(req);
        const stories = await api.getAllStoriesNoLimit();
        const categories = await api.getCategories();

        res.setHeader('Content-Type', 'text/xml');
        res.write(createSitemap(url, paths, stories, categories));
        res.end();

        return null;
    }
}

export default Sitemap;
