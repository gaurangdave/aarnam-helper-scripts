"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleStorageHelper_1 = require("./GoogleStorageHelper");
const logger = require("../../logger");
const moduleName = "GoogleStorageHelper";
exports.initialize = (params) => {
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
    initialize: exports.initialize
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvZ29vZ2xlL3N0b3JhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrREFBNEQ7QUFHNUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZDLE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDO0FBTTVCLFFBQUEsVUFBVSxHQUFHLENBQ3RCLE1BQTRCLEVBQ0YsRUFBRTtJQUM1QixNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUUxQyxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2QsTUFBTSxDQUFDLEtBQUssQ0FDUixHQUFHLFVBQVUsc0RBQXNELENBQ3RFLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNaLE1BQU0sQ0FBQyxLQUFLLENBQ1IsR0FBRyxVQUFVLHVEQUF1RCxDQUN2RSxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELE9BQU8sSUFBSSx5Q0FBbUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDM0QsQ0FBQyxDQUFDO0FBT0YsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLFVBQVUsRUFBVixrQkFBVTtDQUNiLENBQUMifQ==