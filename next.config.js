// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs');
const path = require('path');

const globalSassImports = `\
    @import "styles/variables";
    @import "styles/mixins";
`;

const moduleExports = withBundleAnalyzer({
    async rewrites() {
        return [
            {
                source: '/feed',
                destination: '/api/rss',
            },
            {
                source: '/category/:category/feed',
                destination: '/api/rss',
            },
            {
                source: '/rss.xml',
                destination: '/api/rss',
            },
            {
                source: '/js/pl.js',
                destination: 'https://plausible.io/js/plausible.js',
            },
            {
                source: '/api/pl', // Or '/api/event/' if you have `trailingSlash: true` in this config
                destination: 'https://plausible.io/api/event',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: 'upgrade-insecure-requests; report-uri https://prezly.report-uri.com/r/d/csp/enforce;',
                    },
                ],
            },
        ];
    },
    images: {
        domains: ['cdn.uc.assets.prezly.com', 'ucarecdn.com'],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
        prependData: globalSassImports,
    },
    eslint: {
        dirs: ['@types', 'components', 'contexts', 'hooks', 'modules', 'pages', 'utils'],
    },
    experimental: {
        newNextLinkBehavior: true,
        scrollRestoration: true,
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
});

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    // silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

// TODO: Remove `process.env.VERCEL !== '1'` part when Sentry/Vercel errors are fixed
const IS_SENTRY_ENABLED =
    process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1' && SENTRY_DSN;

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = IS_SENTRY_ENABLED
    ? withSentryConfig(moduleExports, sentryWebpackPluginOptions)
    : moduleExports;
