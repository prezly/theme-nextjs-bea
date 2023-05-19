const Fs = require('fs');

const LINK_MODULES = Boolean(process.env.LINK_MODULES);

const workspace =
    LINK_MODULES && Fs.existsSync('./pnpm-workspace.yaml')
        ? require('@manypkg/get-packages').getPackagesSync(process.cwd())
        : { packages: [] };

const rootPkg = require('./package.json');

const PEER_DEPENDENCIES = ['@types/react', '@types/react-dom', 'react', 'react-dom', 'next'];

/**
 * @typedef {object} PackageJson
 * @property {string} name
 * @property {Record<string,string>} dependencies
 * @property {Record<string,string>} peerDependencies
 */

/**
 * @param {PackageJson} pkg
 * @param {{ log:(msg: string)=>void }}context
 * @returns {T|*}
 */
function readPackage(pkg, context) {
    if (!LINK_MODULES) {
        return pkg; // no special logic if the env variable is not set
    }

    if (pkg.name === rootPkg.name) {
        // Make sure we use `workspace:*` protocol for linked packages
        return workspace.packages.reduce((pkg, workspacePackage) => {
            const dependencyName = workspacePackage.packageJson.name;
            const dependencyVersion = 'workspace:*';

            if (pkg.dependencies[dependencyName]) {
                context.log(
                    `Updating "${dependencyName}" dependency of "${pkg.name}" to "${dependencyVersion}"`,
                );

                return {
                    ...pkg,
                    dependencies: updateDependencies(pkg.dependencies, {
                        [dependencyName]: dependencyVersion,
                    }),
                };
            }
            return pkg;
        }, pkg);
    }

    if (pkg.peerDependencies) {
        pkg = PEER_DEPENDENCIES.reduce((pkg, dependencyName) => {
            if (rootPkg.dependencies[dependencyName] && pkg.peerDependencies[dependencyName]) {
                context.log(`Skipping peerDependency "${dependencyName}" of "${pkg.name}".`);

                return {
                    ...pkg,
                    peerDependencies: omitDependency(pkg.peerDependencies, dependencyName),
                };
            }
            return pkg;
        }, pkg);
    }

    return pkg;
}

/**
 * @param {Record<string,string>} dependencies
 * @param {Record<string,string>} updatedDependencies
 * @returns {Record<string,string>}
 */
function updateDependencies(dependencies, updatedDependencies) {
    return Object.fromEntries(
        Object.entries(dependencies).map(([name, version]) => [
            name,
            updatedDependencies[name] ?? version,
        ]),
    );
}

/**
 * @param {Record<string,string>} dependencies
 * @param {string} omit
 * @returns {Record<string,string>}
 */
function omitDependency(dependencies, omit) {
    return Object.fromEntries(Object.entries(dependencies).filter(([name]) => name !== omit));
}

module.exports = {
    hooks: {
        readPackage,
    },
};
