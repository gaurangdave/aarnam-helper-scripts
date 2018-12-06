"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MinioHelper_1 = require("./MinioHelper");
const logger_1 = require("../logger");
const moduleName = "MinioHelper";
exports.initialize = (params) => {
    const { accessKey, secretKey, endPoint } = params;
    const logger = new logger_1.Logger();
    if (!endPoint) {
        logger.error(`${moduleName}: Cannot Initialize : undefined or invalid endPoint.`);
        return null;
    }
    if (!accessKey) {
        logger.error(`${moduleName}: Cannot Initialize : undefined or invalid accessKey.`);
        return null;
    }
    if (!secretKey) {
        logger.error(`${moduleName}: Cannot Initialize : undefined or invalid secretKey.`);
        return null;
    }
    return new MinioHelper_1.MinioHelper(accessKey, secretKey, endPoint);
};
module.exports = { initialize: exports.initialize };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbWluaW8vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBNEM7QUFDNUMsc0NBQW1DO0FBRW5DLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQztBQU1wQixRQUFBLFVBQVUsR0FBRyxDQUN0QixNQUE0QixFQUNWLEVBQUU7SUFDcEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7SUFFNUIsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQ1IsR0FBRyxVQUFVLHNEQUFzRCxDQUN0RSxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDWixNQUFNLENBQUMsS0FBSyxDQUNSLEdBQUcsVUFBVSx1REFBdUQsQ0FDdkUsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osTUFBTSxDQUFDLEtBQUssQ0FDUixHQUFHLFVBQVUsdURBQXVELENBQ3ZFLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsT0FBTyxJQUFJLHlCQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUM7QUFRRixNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsVUFBVSxFQUFWLGtCQUFVLEVBQUUsQ0FBQyJ9