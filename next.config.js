const path = require('path');

const locales = require('./locale.config');

const globalSassImports = `\
    @import "styles/variables";
    @import "styles/mixins";
`;

module.exports = {
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
        locales: [...locales.map((l) => l.toLowerCase()), 'qps-ploc'],
        // This is the default locale you want to be used when visiting
        // a non-locale prefixed path e.g. `/hello`
        // We use Pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
        defaultLocale: 'qps-ploc',
        // Default locale detection is disabled, since the locales would be determined by Prezly API
        localeDetection: false,
    },
};
