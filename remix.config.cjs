/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    appDirectory: 'remix',
    assetsBuildDirectory: 'public/build',
    future: {
        /* any enabled future flags */
        dev_v2: true,
    },
    ignoredRouteFiles: ['**/.*'],
    publicPath: '/build/',
    serverBuildPath: 'build/index.js',
};
