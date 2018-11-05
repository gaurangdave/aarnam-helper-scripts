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
module.exports = exports.initialize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9taW5pby9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUE0QztBQUM1QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEMsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO0FBTXBCLFFBQUEsVUFBVSxHQUFHLENBQ3RCLE1BQTRCLEVBQ1YsRUFBRTtJQUNwQixNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFDbEQsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQ1IsR0FBRyxVQUFVLHNEQUFzRCxDQUN0RSxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDWixNQUFNLENBQUMsS0FBSyxDQUNSLEdBQUcsVUFBVSx1REFBdUQsQ0FDdkUsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osTUFBTSxDQUFDLEtBQUssQ0FDUixHQUFHLFVBQVUsdURBQXVELENBQ3ZFLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsT0FBTyxJQUFJLHlCQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUM7QUFRRixNQUFNLENBQUMsT0FBTyxHQUFHLGtCQUFVLENBQUMifQ==