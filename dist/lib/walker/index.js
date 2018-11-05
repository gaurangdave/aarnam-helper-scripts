"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Objservable = require("rxjs").Observable;
const filter = require("rxjs/operators").filter;
const fs = require("fs");
const walk = require("walk");
const filters = require("./filters");
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
const nodeWalker = (type, dirPath) => Objservable.create((observer) => {
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
exports.fileWalker = (dirName) => nodeWalker("file", dirName).pipe(filter((filePath) => filters.ignoreFiles({
    filePath,
    filesToIgnore,
    extensionsToIgnore
})));
module.exports = {
    directoryWalker: exports.directoryWalker,
    fileWalker: exports.fileWalker
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvd2Fsa2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDL0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ2hELE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBS3JDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUUvRSxNQUFNLGFBQWEsR0FBRztJQUNsQixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLFlBQVk7SUFDWixhQUFhO0lBQ2IsYUFBYTtJQUNiLFdBQVc7SUFDWCxtQkFBbUI7SUFDbkIsY0FBYztJQUNkLGVBQWU7SUFDZixhQUFhO0lBQ2IsV0FBVztDQUNkLENBQUM7QUFHRixNQUFNLGtCQUFrQixHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBUTNDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBWSxFQUFFLE9BQWUsRUFBRSxFQUFFLENBQ2pELFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtJQUVqQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN6QixRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN2QjtJQUVELE1BQU0sT0FBTyxHQUFHO1FBQ1osY0FBYyxFQUFFLElBQUk7UUFDcEIsT0FBTyxFQUFFLG1CQUFtQjtLQUMvQixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFM0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBUyxJQUFZLEVBQUUsU0FBYyxFQUFFLElBQWM7UUFDakUsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzQyxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFDaEIsSUFBWSxFQUNaLGNBQW1CLEVBQ25CLElBQWM7UUFFZCxRQUFRLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakMsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFO1FBQ2IsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFPTSxRQUFBLGVBQWUsR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFFLENBQy9DLFVBQVUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFNeEIsUUFBQSxVQUFVLEdBQUcsQ0FBQyxPQUFlLEVBQUUsRUFBRSxDQUMxQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDNUIsTUFBTSxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQ3hCLE9BQU8sQ0FBQyxXQUFXLENBQUM7SUFDaEIsUUFBUTtJQUNSLGFBQWE7SUFDYixrQkFBa0I7Q0FDckIsQ0FBQyxDQUNMLENBQ0osQ0FBQztBQUVOLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixlQUFlLEVBQWYsdUJBQWU7SUFDZixVQUFVLEVBQVYsa0JBQVU7Q0FDYixDQUFDIn0=