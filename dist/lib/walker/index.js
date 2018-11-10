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
const nodeWalker = (type, dirPath) => rxjs_1.Observable.create((observer) => {
    if (!fs.existsSync(dirPath)) {
        observer.error(`${dirPath} does not exist!`);
        observer.complete();
    }
    const options = {
        "walk-recurse": true,
        filters: directoriesToIgnore
    };
    const walker = walk.walk(dirPath, options);
    walker.on(type, function (root, fileStats, next) {
        observer.next(`${root}/${fileStats.name}`);
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
module.exports = {
    directoryWalker: exports.directoryWalker,
    fileWalker: exports.fileWalker
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvd2Fsa2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsK0JBQWtDO0FBQ2xDLDhDQUF3QztBQUN4Qyx1Q0FBd0M7QUFHeEMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRS9FLE1BQU0sYUFBYSxHQUFHO0lBQ2xCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhO0lBQ2IsV0FBVztJQUNYLG1CQUFtQjtJQUNuQixjQUFjO0lBQ2QsZUFBZTtJQUNmLGFBQWE7SUFDYixXQUFXO0NBQ2QsQ0FBQztBQUdGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFRM0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFZLEVBQUUsT0FBZSxFQUFzQixFQUFFLENBQ3JFLGlCQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUU7SUFFaEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDekIsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sa0JBQWtCLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdkI7SUFFRCxNQUFNLE9BQU8sR0FBRztRQUNaLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLE9BQU8sRUFBRSxtQkFBbUI7S0FDL0IsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTNDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVMsSUFBWSxFQUFFLFNBQWMsRUFBRSxJQUFjO1FBQ2pFLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQ2hCLElBQVksRUFDWixjQUFtQixFQUNuQixJQUFjO1FBRWQsUUFBUSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pDLElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRTtRQUNiLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDO0FBT00sUUFBQSxlQUFlLEdBQUcsQ0FBQyxPQUFlLEVBQXNCLEVBQUUsQ0FDbkUsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQU14QixRQUFBLFVBQVUsR0FBRyxDQUFDLE9BQWUsRUFBc0IsRUFBRSxDQUM5RCxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDNUIsa0JBQU0sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUN4QixxQkFBVyxDQUFDO0lBQ1IsUUFBUTtJQUNSLGFBQWE7SUFDYixrQkFBa0I7Q0FDckIsQ0FBQyxDQUNMLENBQ0osQ0FBQztBQUVOLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixlQUFlLEVBQWYsdUJBQWU7SUFDZixVQUFVLEVBQVYsa0JBQVU7Q0FDYixDQUFDIn0=