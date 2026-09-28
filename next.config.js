const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const withThemeKitConfig = require('@prezly/theme-kit-nextjs/next-config').createNextConfig({
    recommendedHeaders: false,
});
const { withSentryConfig } = require('@sentry/nextjs/config');
const path = require('path');

const globalSassImports = `\
    @use "src/styles/variables" as *;
    @use "src/styles/mixins" as *;
`;

const CONTENT_SECURITY_POLICY =
    "upgrade-insecure-requests; report-uri https://csp.prezly.net/report; frame-ancestors 'self'";
const PREVIEW_CONTENT_SECURITY_POLICY = `${CONTENT_SECURITY_POLICY} https://rock.prezly.com`;

const moduleExports = withBundleAnalyzer(
    withThemeKitConfig({
        env: {
            PREZLY_MODE: process.env.PREZLY_MODE,
        },
        async headers() {
            return [
                {
                    source: '/(.*)',
                    locale: false,
                    headers: [
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
                            value: CONTENT_SECURITY_POLICY,
                        },
                    ],
                },
                {
                    source: '/(.*)',
                    locale: false,
                    has: [{ type: 'query', key: 'preview', value: 'true' }],
                    headers: [
                        {
                            key: 'Content-Security-Policy',
                            value: PREVIEW_CONTENT_SECURITY_POLICY,
                        },
                    ],
                },
            ];
        },
        images: {
            loader: 'custom',
        },
        sassOptions: {
            includePaths: [path.join(__dirname, 'src', 'styles')],
            prependData: globalSassImports,
        },
        webpack(config) {
            config.module.rules.push({
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            });

            return config;
        },
    }),
);

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
