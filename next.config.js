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

        return config;
    },
};
