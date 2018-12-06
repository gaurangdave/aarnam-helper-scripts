"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleStorageHelper_1 = require("./GoogleStorageHelper");
const logger_1 = require("../../logger");
const moduleName = "GoogleStorageHelper";
exports.initialize = (params) => {
    const { keyFilePath, projectId } = params;
    const lg = new logger_1.Logger();
    if (!keyFilePath) {
        lg.error(`${moduleName}: Cannot Initialize : undefined or invalid key file.`);
        return null;
    }
    if (!projectId) {
        lg.error(`${moduleName}: Cannot Initialize : undefined or invalid projectId.`);
        return null;
    }
    return new GoogleStorageHelper_1.GoogleStorageHelper(keyFilePath, projectId);
};
module.exports = {
    initialize: exports.initialize
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvZ29vZ2xlL3N0b3JhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrREFBNEQ7QUFDNUQseUNBQXNDO0FBRXRDLE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDO0FBTTVCLFFBQUEsVUFBVSxHQUFHLENBQ3RCLE1BQTRCLEVBQ0YsRUFBRTtJQUM1QixNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUMxQyxNQUFNLEVBQUUsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0lBRXhCLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDZCxFQUFFLENBQUMsS0FBSyxDQUNKLEdBQUcsVUFBVSxzREFBc0QsQ0FDdEUsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osRUFBRSxDQUFDLEtBQUssQ0FDSixHQUFHLFVBQVUsdURBQXVELENBQ3ZFLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsT0FBTyxJQUFJLHlDQUFtQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUM7QUFPRixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsVUFBVSxFQUFWLGtCQUFVO0NBQ2IsQ0FBQyJ9