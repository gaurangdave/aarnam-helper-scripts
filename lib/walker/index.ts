const path = require("path");
const fs = require("fs");
const walk = require("walk");

import { Observable, Observer } from "rxjs";
import { filter } from "rxjs/operators";
import { ignoreFiles } from "./filters";
import { dirname } from "path";

// hard coded array of directories to ignore
const directoriesToIgnore = ["node_modules", ".git", ".eslintignore", ".idea"];

const filesToIgnore = [
    ".eslintignore",
    ".eslintrc.json",
    ".gitignore",
    ".prettierrc",
    "Jenkinsfile",
    "README.md",
    "package-lock.json",
    "package.json",
    "tsconfig.json",
    "tslint.json",
    ".DS_Store"
];

//
const extensionsToIgnore = [".ts", ".map"];

/**
 * Generic node walker to walk through a given directory. Triggers events based on file type passed.
 * @param {*} type
 * @param {*} dirPath
 * @return Observable
 */
const nodeWalker = (
    type: string = "all",
    dirPath: string
): Observable<WalkerFsObject> =>
    Observable.create((observer: Observer<WalkerFsObject>) => {
        // const directoryToParse = path.resolve(ROOT_DIR, dirPath);
        if (!fs.existsSync(dirPath)) {
            observer.error(`${dirPath} does not exist!`);
            observer.complete();
        }

        const options = {
            "walk-recurse": true,
            filters: directoriesToIgnore
        };

        const walker = walk.walk(dirPath, options);

        walker.on("directory", function(
            root: string,
            dirStats: any,
            next: Function
        ) {
            if (type === "directory" || type === "all") {
                observer.next({
                    filePath: `${root}/${dirStats.name}`,
                    stats: dirStats
                });
            }
            next();
        });

        walker.on("file", function(
            root: string,
            fileStats: any,
            next: Function
        ) {
            if (type === "file" || type === "all") {
                observer.next({
                    filePath: `${root}/${fileStats.name}`,
                    stats: fileStats
                });
            }
            next();
        });

        walker.on("errors", function(
            root: string,
            nodeStatsArray: any,
            next: Function
        ) {
            observer.error(`Error parsing!`);
            next();
        });

        walker.on("end", function() {
            observer.complete();
        });
    });

/**
 * Function to create stream of directories from give source.
 * @param {*} dirName
 * @return {Observer<T>}
 */
export const directoryWalker = (dirName: string): Observable<WalkerFsObject> =>
    nodeWalker("directory", dirName);

/**
 * Function to create stream of files from given source.
 * @param {*} dirName
 */
export const fileWalker = (dirName: string): Observable<WalkerFsObject> =>
    nodeWalker("file", dirName).pipe(
        filter((contentObj: WalkerFsObject) =>
            ignoreFiles({
                filePath: contentObj.filePath,
                filesToIgnore,
                extensionsToIgnore
            })
        )
    );

export const contentWalker = (dirName: string): Observable<WalkerFsObject> => {
    return nodeWalker("all", dirName).pipe(
        filter((contentObj: WalkerFsObject) =>
            ignoreFiles({
                filePath: contentObj.filePath,
                filesToIgnore,
                extensionsToIgnore
            })
        )
    );
};

module.exports = {
    directoryWalker,
    fileWalker,
    contentWalker
};

export type WalkerFsObject = {
    filePath: string;
    stats: any;
};
