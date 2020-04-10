const path = require('path');
const semver = require('semver');
const rif = require('replace-in-file');
const git = require('simple-git');

require('pkginfo')(module, 'version', 'author');

export default module.exports;

export const updateVersion = () => {
    let newVersion = '';
    const buildBump = process.argv.slice(2)[0];

    switch (buildBump) {
        case 'premajor':
            newVersion = semver.inc(module.exports.version, 'premajor', 'dev');
            break;
        case 'preminor':
            newVersion = semver.inc(module.exports.version, 'preminor', 'dev');
            break;
        case 'prepatch':
            newVersion = semver.inc(module.exports.version, 'prepatch', 'dev');
            break;
        case 'major':
            newVersion = semver.inc(module.exports.version, 'major');
            break;
        case 'minor':
            newVersion = semver.inc(module.exports.version, 'minor');
            break;
        case 'patch':
            newVersion = semver.inc(module.exports.version, 'patch');
            break;
        default:
            newVersion = semver.inc(module.exports.version, 'prerelease', 'dev');
    }

    if (newVersion !== '') {
        try {
            const riffed = rif.sync({
                files: [`${path.resolve(__dirname)}/package.json`],
                from: [`"version": "${module.exports.version}"`],
                to: [`"version": "${newVersion}"`],
            });

            console.log(riffed);

            return newVersion;
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }
};

export const gitPush = (version: string | undefined) => {
    if (typeof version === 'undefined') return false;

    git()
        .add(`${path.resolve(__dirname)}/*`)
        .commit(version)
        .addTag(version)
        .push(['-u', 'origin', version], () => console.log(`Pushed version ${version}...`));
};
