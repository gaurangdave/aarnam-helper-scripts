"use strict";
const MinioHelper = require("./MinioHelper");
const logger = require("../logger");
const moduleName = "MinioHelper";
/**
 *
 * @param params
 */
const initialize = (params = {}) => {
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
    return new MinioHelper(accessKey, secretKey, endPoint);
};
module.exports = { initialize };
