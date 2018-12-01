"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const walk = require("walk");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const filters_1 = require("./filters");
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
const extensionsToIgnore = [".ts", ".map"];
const nodeWalker = (type = "all", dirPath) => rxjs_1.Observable.create((observer) => {
    if (!fs.existsSync(dirPath)) {
        observer.error(`${dirPath} does not exist!`);
        observer.complete();
    }
    const options = {
        "walk-recurse": true,
        filters: directoriesToIgnore
    };
    const walker = walk.walk(dirPath, options);
    walker.on("directory", function (root, dirStats, next) {
        if (type === "directory" || type === "all") {
            observer.next({
                filePath: `${root}/${dirStats.name}`,
                stats: dirStats
            });
        }
        next();
    });
    walker.on("file", function (root, fileStats, next) {
        if (type === "file" || type === "all") {
            observer.next({
                filePath: `${root}/${fileStats.name}`,
                stats: fileStats
            });
        }
        next();
    });
    walker.on("errors", function (root, nodeStatsArray, next) {
        observer.error(`Error parsing!`);
        next();
    });
    walker.on("end", function () {
        observer.complete();
    });
});
exports.directoryWalker = (dirName) => nodeWalker("directory", dirName);
exports.fileWalker = (dirName) => nodeWalker("file", dirName).pipe(operators_1.filter((contentObj) => filters_1.ignoreFiles({
    filePath: contentObj.filePath,
    filesToIgnore,
    extensionsToIgnore
})));
exports.contentWalker = (dirName) => {
    return nodeWalker("all", dirName).pipe(operators_1.filter((contentObj) => filters_1.ignoreFiles({
        filePath: contentObj.filePath,
        filesToIgnore,
        extensionsToIgnore
    })));
};
module.exports = {
    directoryWalker: exports.directoryWalker,
    fileWalker: exports.fileWalker,
    contentWalker: exports.contentWalker
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvd2Fsa2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsK0JBQTRDO0FBQzVDLDhDQUF3QztBQUN4Qyx1Q0FBd0M7QUFJeEMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRS9FLE1BQU0sYUFBYSxHQUFHO0lBQ2xCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhO0lBQ2IsV0FBVztJQUNYLG1CQUFtQjtJQUNuQixjQUFjO0lBQ2QsZUFBZTtJQUNmLGFBQWE7SUFDYixXQUFXO0NBQ2QsQ0FBQztBQUdGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFRM0MsTUFBTSxVQUFVLEdBQUcsQ0FDZixPQUFlLEtBQUssRUFDcEIsT0FBZSxFQUNXLEVBQUUsQ0FDNUIsaUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFrQyxFQUFFLEVBQUU7SUFFckQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDekIsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sa0JBQWtCLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdkI7SUFFRCxNQUFNLE9BQU8sR0FBRztRQUNaLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLE9BQU8sRUFBRSxtQkFBbUI7S0FDL0IsQ0FBQztJQUVGLE1BQU0sTUFBTSxH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