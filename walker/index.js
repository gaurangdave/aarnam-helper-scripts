const path = require('path');
const Objservable = require('rxjs').Observable;
const filter = require('rxjs/operators').filter;
const fs = require('fs');
const walk = require('walk');
const filters = require('../filters');

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');

// hard coded array of directories to ignore
const directoriesToIgnore = ['node_modules', '.git', '.eslintignore', '.idea'];
//
const filesToIgnore = [
     '.eslintignore',
     '.eslintrc.json',
     '.gitignore',
     '.prettierrc',
     'Jenkinsfile',
     'README.md',
     'package-lock.json',
     'package.json',
     'tsconfig.json',
     'tslint.json',
     '.DS_Store',
];

//
const extensionsToIgnore = ['.ts', '.map'];

/**
 * Generic node walker to walk through a given directory. Triggers events based on file type passed.
 * @param {*} type
 * @param {*} dirName
 * @return Observable
 */
const nodeWalker = (type, dirName) =>
     Objservable.create(observer => {
          const directoryToParse = path.resolve(ROOT_DIR, dirName);
          if (!fs.existsSync(directoryToParse)) {
               observer.error(`${directoryToParse} does not exist!`);
               observer.complete();
          }

          const options = {
               'walk-recurse': true,
               filters: directoriesToIgnore,
          };

          walker = walk.walk(directoryToParse, options);

          walker.on(type, function (root, fileStats, next) {
               observer.next(`${root}/${fileStats.name}`);
               next();
          });

          walker.on('errors', function (root, nodeStatsArray, next) {
               observer.error(`Error parsing!`);
               next();
          });

          walker.on('end', function () {
               observer.complete();
          });
     });

/**
 * Function to create stream of directories from give source.
 * @param {*} dirName
 * @return {Observer<T>}
 */
const directoryWalker = dirName => nodeWalker('directory', dirName);

/**
 * Function to create stream of files from given source.
 * @param {*} dirName
 */
const fileWalker = dirName =>
     nodeWalker('file', dirName).pipe(
          filter(filePath =>
               filters.ignoreFiles({
                    filePath,
                    filesToIgnore,
                    extensionsToIgnore,
               })
          )
     );

module.exports = {
     directoryWalker,
     fileWalker,
};