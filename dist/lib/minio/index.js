"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MinioHelper_1 = require("./MinioHelper");
const logger = require("../logger");
const moduleName = "MinioHelper";
exports.initialize = (params) => {
    const { accessKey, secretKey, endPoint } = params;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbWluaW8vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBNEM7QUFDNUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQztBQU1wQixRQUFBLFVBQVUsR0FBRyxDQUN0QixNQUE0QixFQUNWLEVBQUU7SUFDcEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQ2xELElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDWCxNQUFNLENBQUMsS0FBSyxDQUNSLEdBQUcsVUFBVSxzREFBc0QsQ0FDdEUsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osTUFBTSxDQUFDLEtBQUssQ0FDUixHQUFHLFVBQVUsdURBQXVELENBQ3ZFLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNaLE1BQU0sQ0FBQyxLQUFLLENBQ1IsR0FBRyxVQUFVLHVEQUF1RCxDQUN2RSxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELE9BQU8sSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0QsQ0FBQyxDQUFDO0FBUUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLFVBQVUsRUFBVixrQkFBVSxFQUFFLENBQUMifQ==