import React from 'react';
import globby from 'globby';
import { getPrezlyApi } from '@/utils/prezly';
import { Story } from '@prezly/sdk/dist/types';
import { NextPageContext } from 'next';

const createSitemap = (url: string, paths: Array<string>, stories: Array<Story>) => `<?xml version="1.0" encoding="UTF-8"?>
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
    </urlset>
`;

class Sitemap extends React.Component {
    static async getInitialProps(ctx: NextPageContext) {
        if (ctx.req == null) { // client side
            return null;
        }

        const paths = await globby([
            'pages/**/*{.tsx,.ts}',
            '!pages/**/[*', // ignore dynamic paths
            '!pages/_*.js', // ignore nextjs special paths
            '!pages/api', // ignore api routes
        ]);

        const { res } = ctx;
        const url = ctx.req?.headers.host || '/';

        const api = getPrezlyApi(ctx.req);
        const stories = await api.getAllStories(1000);

        res?.setHeader('Content-Type', 'text/xml');
        res?.write(createSitemap(url, paths, stories));
        res?.end();

        return null;
    }
}

export default Sitemap;
