// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const withThemeKitConfig = require('@prezly/theme-kit-nextjs/next-config').createNextConfig();
const { withSentryConfig } = require('@sentry/nextjs');
const path = require('path');

const globalSassImports = `\
    @import "styles/variables";
    @import "styles/mixins";
`;

const moduleExports = withBundleAnalyzer(
    withThemeKitConfig({
        env: {
            PREZLY_MODE: process.env.PREZLY_MODE,
        },
        images: {
            loader: 'custom',
        },
        sassOptions: {
            includePaths: [path.join(__dirname, 'styles')],
            prependData: globalSassImports,
        },
        eslint: {
            dirs: [
                '@types',
                'components',
                'contexts',
                'hooks',
                'icons',
                'modules',
                'pages',
                'utils',
                'ui',
            ],
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
