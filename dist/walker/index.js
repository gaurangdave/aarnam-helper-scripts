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
const directoryWalker = (dirName) => nodeWalker("directory", dirName);
const fileWalker = (dirName) => nodeWalker("file", dirName).pipe(filter((filePath) => filters.ignoreFiles({
    filePath,
    filesToIgnore,
    extensionsToIgnore
})));
module.exports = {
    directoryWalker,
    fileWalker
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi93YWxrZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUMvQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDaEQsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFLckMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRS9FLE1BQU0sYUFBYSxHQUFHO0lBQ2xCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhO0lBQ2IsV0FBVztJQUNYLG1CQUFtQjtJQUNuQixjQUFjO0lBQ2QsZUFBZTtJQUNmLGFBQWE7SUFDYixXQUFXO0NBQ2QsQ0FBQztBQUdGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFRM0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFZLEVBQUUsT0FBZSxFQUFFLEVBQUUsQ0FDakQsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO0lBRWpDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3pCLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLGtCQUFrQixDQUFDLENBQUM7UUFDN0MsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3ZCO0lBRUQsTUFBTSxPQUFPLEdBQUc7UUFDWixjQUFjLEVBQUUsSUFBSTtRQUNwQixPQUFPLEVBQUUsbUJBQW1CO0tBQy9CLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUUzQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxVQUFTLElBQVksRUFBRSxTQUFjLEVBQUUsSUFBYztRQUNqRSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUNoQixJQUFZLEVBQ1osY0FBbUIsRUFDbkIsSUFBYztRQUVkLFFBQVEsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNqQyxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7UUFDYixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQztBQU9QLE1BQU0sZUFBZSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBTTlFLE1BQU0sVUFBVSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FDbkMsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQzVCLE1BQU0sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUN4QixPQUFPLENBQUMsV0FBVyxDQUFDO0lBQ2hCLFFBQVE7SUFDUixhQUFhO0lBQ2Isa0JBQWtCO0NBQ3JCLENBQUMsQ0FDTCxDQUNKLENBQUM7QUFFTixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsZUFBZTtJQUNmLFVBQVU7Q0FDYixDQUFDIn0=