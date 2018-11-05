"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleStorageHelper_1 = require("./GoogleStorageHelper");
const logger = require("../../logger");
const moduleName = "GoogleStorageHelper";
const initialize = (params) => {
    const { keyFilePath, projectId } = params;
    if (!keyFilePath) {
        logger.error(`${moduleName}: Cannot Initialize : undefined or invalid key file.`);
        return null;
    }
    if (!projectId) {
        logger.error(`${moduleName}: Cannot Initialize : undefined or invalid projectId.`);
        return null;
    }
    return new GoogleStorageHelper_1.GoogleStorageHelper(keyFilePath, projectId);
};
module.exports = {
    initialize
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nb29nbGUvc3RvcmFnZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtEQUE0RDtBQUc1RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcscUJBQXFCLENBQUM7QUFNekMsTUFBTSxVQUFVLEdBQUcsQ0FDZixNQUE0QixFQUNGLEVBQUU7SUFDNUIsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFFMUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNkLE1BQU0sQ0FBQyxLQUFLLENBQ1IsR0FBRyxVQUFVLHNEQUFzRCxDQUN0RSxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDWixNQUFNLENBQUMsS0FBSyxDQUNSLEdBQUcsVUFBVSx1REFBdUQsQ0FDdkUsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxPQUFPLElBQUkseUNBQW1CLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQztBQU9GLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixVQUFVO0NBQ2IsQ0FBQyJ9