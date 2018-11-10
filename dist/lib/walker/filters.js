"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.ignoreFiles = (params) => {
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
    ignoreFiles: exports.ignoreFiles
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi93YWxrZXIvZmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVoQixRQUFBLFdBQVcsR0FBRyxDQUFDLE1BQVcsRUFBRSxFQUFFO0lBQ3ZDLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxHQUFHLEVBQUUsRUFBRSxrQkFBa0IsR0FBRyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFFekUsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNwRSxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELElBQ0ksa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDN0Isa0JBQWtCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNsRDtRQUNFLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLFdBQVcsRUFBWCxtQkFBVztDQUNkLENBQUMifQ==