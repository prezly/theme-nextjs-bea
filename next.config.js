const { withSentryConfig } = require('@sentry/nextjs');
const path = require('path');

const locales = require('./locale.config');

const globalSassImports = `\
    @import "styles/variables";
    @import "styles/mixins";
`;

const moduleExports = {
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
                ],
            },
        ];
    },
    env: {
        ALGOLIA_PUBLIC_API_KEY: process.env.ALGOLIA_PUBLIC_API_KEY,
        ALGOLIA_INDEX: process.env.ALGOLIA_INDEX,
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    },
    images: {
        domains: ['cdn.uc.assets.prezly.com'],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
        prependData: globalSassImports,
    },
    eslint: {
        dirs: ['components', 'contexts', 'hooks', 'modules', 'pages', 'utils'],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    i18n: {
        // These are all the locales you want to support in
        // your application
        locales: [...locales, 'qps-ploc'],
        // This is the default locale you want to be used when visiting
        // a non-locale prefixed path e.g. `/hello`
        // We use Pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
        defaultLocale: 'qps-ploc',
        // Default locale detection is disabled, since the locales would be determined by Prezly API
        localeDetection: false,
    },
};

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

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// TODO: Remove `process.env.VERCEL !== '1'` part when Sentry/Vercel errors are fixed
module.exports =
    process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1'
        ? withSentryConfig(moduleExports, sentryWebpackPluginOptions)
        : moduleExports;
