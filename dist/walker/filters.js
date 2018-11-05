"use strict";
const path = require("path");
const ignoreFiles = (params) => {
    const { filePath, filesToIgnore = [], extensionsToIgnore = [] } = params;
    if (!filePath) {
        return false;
    }
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath);
    if (filesToIgnore.length > 0 && filesToIgnore.indexOf(fileName) !== -1) {
        return false;
    }
    if (extensionsToIgnore.length > 0 &&
        extensionsToIgnore.indexOf(fileExtension) !== -1) {
        return false;
    }
    return true;
};
module.exports = {
    ignoreFiles
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3dhbGtlci9maWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFXLEVBQUUsRUFBRTtJQUNoQyxNQUFNLEVBQUUsUUFBUSxFQUFFLGFBQWEsR0FBRyxFQUFFLEVBQUUsa0JBQWtCLEdBQUcsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBRXpFLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDWCxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDcEUsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxJQUNJLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQzdCLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDbEQ7UUFDRSxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixXQUFXO0NBQ2QsQ0FBQyJ9