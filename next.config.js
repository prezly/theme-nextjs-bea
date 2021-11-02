const path = require('path');

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

        // eslint-disable-next-line no-param-reassign
        config.optimization.splitChunks.cacheGroups =
            config.optimization.splitChunks.cacheGroups || {};

        Object.assign(config.optimization.splitChunks.cacheGroups, {
            prezlyUpoadcareImage: {
                test: /[\\/]node_modules[\\/]@prezly\/uploadcare-image[\\/]/,
                priority: 40,
                enforce: true,
                name: 'prezlyUpoadcareImage',
            },
            headlessUi: {
                test: /[\\/]node_modules[\\/]@headlessui\/react[\\/]/,
                priority: 30,
                enforce: true,
                name: 'headlessUi',
            },
        });

        return config;
    },
};
