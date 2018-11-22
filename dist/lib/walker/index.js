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
    walker.on("directory", function (root, fileStats, next) {
        if (type === "directory" || type === "all") {
            observer.next(`${root}/${fileStats.name}`);
        }
        next();
    });
    walker.on("file", function (root, fileStats, next) {
        if (type === "file" || type === "all") {
            observer.next(`${root}/${fileStats.name}`);
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
exports.fileWalker = (dirName) => nodeWalker("file", dirName).pipe(operators_1.filter((filePath) => filters_1.ignoreFiles({
    filePath,
    filesToIgnore,
    extensionsToIgnore
})));
exports.contentWalker = (dirName) => {
    return nodeWalker("all", dirName).pipe(operators_1.filter((filePath) => filters_1.ignoreFiles({
        filePath,
        filesToIgnore,
        extensionsToIgnore
    })));
};
module.exports = {
    directoryWalker: exports.directoryWalker,
    fileWalker: exports.fileWalker,
    contentWalker: exports.contentWalker
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvd2Fsa2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsK0JBQWtDO0FBQ2xDLDhDQUF3QztBQUN4Qyx1Q0FBd0M7QUFJeEMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRS9FLE1BQU0sYUFBYSxHQUFHO0lBQ2xCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhO0lBQ2IsV0FBVztJQUNYLG1CQUFtQjtJQUNuQixjQUFjO0lBQ2QsZUFBZTtJQUNmLGFBQWE7SUFDYixXQUFXO0NBQ2QsQ0FBQztBQUdGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFRM0MsTUFBTSxVQUFVLEdBQUcsQ0FDZixPQUFlLEtBQUssRUFDcEIsT0FBZSxFQUNHLEVBQUUsQ0FDcEIsaUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtJQUVoQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN6QixRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN2QjtJQUVELE1BQU0sT0FBTyxHQUFHO1FBQ1osY0FBYyxFQUFFLElBQUk7UUFDcEIsT0FBTyxFQUFFLG1CQUFtQjtLQUMvQixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFM0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFDbkIsSUFBWSxFQUNaLFNBQWMsRUFDZCxJQUFjO1FBRWQsSUFBSSxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUU7WUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM5QztRQUNELElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUNkLElBQVksRUFDWixTQUFjLEVBQ2QsSUFBYztRQUVkLElBQUksSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ25DLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDOUM7UUFDRCxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFDaEIsSUFBWSxFQUNaLGNBQW1CLEVBQ25CLElBQWM7UUFFZCxRQUFRLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakMsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFO1FBQ2IsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFPTSxRQUFBLGVBQWUsR0FBRyxDQUFDLE9BQWUsRUFBc0IsRUFBRSxDQUNuRSxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBTXhCLFFBQUEsVUFBVSxHQUFHLENBQUMsT0FBZSxFQUFzQixFQUFFLENBQzlELFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUM1QixrQkFBTSxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQ3hCLHFCQUFXLENBQUM7SUFDUixRQUFRO0lBQ1IsYUFBYTtJQUNiLGtCQUFrQjtDQUNyQixDQUFDLENBQ0wsQ0FDSixDQUFDO0FBRU8sUUFBQSxhQUFhLEdBQUcsQ0FBQyxPQUFlLEVBQXNCLEVBQUU7SUFDakUsT0FBTyxVQUFVLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDbEMsa0JBQU0sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUN4QixxQkFBVyxDQUFDO1FBQ1IsUUFBUTtRQUNSLGFBQWE7UUFDYixrQkFBa0I7S0FDckIsQ0FBQyxDQUNMLENBQ0osQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixlQUFlLEVBQWYsdUJBQWU7SUFDZixVQUFVLEVBQVYsa0JBQVU7SUFDVixhQUFhLEVBQWIscUJBQWE7Q0FDaEIsQ0FBQyJ9