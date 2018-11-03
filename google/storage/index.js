"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleStorageHelper_1 = require("./GoogleStorageHelper");
// Imports the Google Cloud client library.
const logger = require("../../logger");
const moduleName = "GoogleStorageHelper";
/**
 * Function to instantiate a client by passing key file and project id.
 * @param {*} params
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtEQUE0RDtBQUU1RCwyQ0FBMkM7QUFDM0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZDLE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDO0FBRXpDOzs7R0FHRztBQUNILE1BQU0sVUFBVSxHQUFHLENBQ2YsTUFBNEIsRUFDRixFQUFFO0lBQzVCLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBRTFDLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDZCxNQUFNLENBQUMsS0FBSyxDQUNSLEdBQUcsVUFBVSxzREFBc0QsQ0FDdEUsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osTUFBTSxDQUFDLEtBQUssQ0FDUixHQUFHLFVBQVUsdURBQXVELENBQ3ZFLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsT0FBTyxJQUFJLHlDQUFtQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUM7QUFPRixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsVUFBVTtDQUNiLENBQUMifQ==