/* eslint-disable max-len */
import { getPrezlyApi } from '@/utils/prezly';
import { Category, Story } from '@prezly/sdk/dist/types';
import { NextPage, NextPageContext } from 'next';

type Url = {
    loc: string;
    changefreq?: string;
    priority?: string;
};

class SitemapBuilder {
    private baseUrl: string;

    private urls: Url[] = [];

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    addUrl(loc: string) {
        this.urls.push({
            loc: this.baseUrl + loc,
            changefreq: SitemapBuilder.guessFrequency(loc),
            priority: SitemapBuilder.guessPriority(loc),
        });
    }

    private static guessFrequency(loc: string) {
        if (loc === '/') return 'daily';

        return 'weekly';
    }

    private static guessPriority(loc: string) {
        if (loc === '/') return '0.9';

        if (loc.startsWith('/category/')) {
            return '0.8';
        }

        return '0.7';
    }

    static serializeLoc(url: Url) {
        return [
            '<url>',
            url.loc && `\t<loc>${url.loc}</loc>`,
            url.changefreq && `\t<changefreq>${url.changefreq}</changefreq>`,
            url.priority && `\t<priority>${url.priority}</priority>`,
            '</url>',
        ]
            .filter(Boolean)
            .join('\n');
    }

    serialize() {
        return [
            '<?xml version="1.0" encoding="UTF-8" ?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
            this.urls.map(SitemapBuilder.serializeLoc).join('\n'),
            '</urlset>',
        ].join('\n');
    }
}

const createPaths = (stories: Story[], categories: Category[]) => {
    const storiesUrls = stories.map(({ slug }) => `/${slug}`);
    const categoriesUrls = categories
        .map((category) => {
            const translations = Object.values(category.i18n);
            const allSlugs = translations
                .map(({ slug }) => slug || '')
                .filter(Boolean)
                .reduce(
                    (slugs, slug) => (slugs.includes(slug) ? [...slugs] : [...slugs, slug]),
                    [] as string[],
                );

            return allSlugs.map((slug) => `/category/${slug}`);
        })
        .flat();

    return [...storiesUrls, ...categoriesUrls];
};

const Sitemap: NextPage = () => null;

Sitemap.getInitialProps = async (ctx: NextPageContext) => {
    const { res, req } = ctx;

    if (!req || !res) {
        // client side
        return null;
    }

    const baseUrl = req.headers.host || '/';

    const api = getPrezlyApi(req);
    const stories = await api.getAllStories();
    const categories = await api.getCategories();

    const paths = createPaths(stories, categories);
    const sitemapBuilder = new SitemapBuilder(baseUrl);

    sitemapBuilder.addUrl('/');
    paths.forEach((path) => sitemapBuilder.addUrl(path));

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapBuilder.serialize());
    res.end();

    return null;
};

export default Sitemap;
