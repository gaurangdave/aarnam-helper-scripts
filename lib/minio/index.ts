import { MinioHelper } from "./MinioHelper";
import { Logger } from "../logger";

const moduleName = "MinioHelper";

/**
 *
 * @param params
 */
export const initialize = (
    params: InitializationParams
): MinioHelper | null => {
    const { accessKey, secretKey, endPoint } = params;
    const logger = new Logger();

    if (!endPoint) {
        logger.error(
            `${moduleName}: Cannot Initialize : undefined or invalid endPoint.`
        );
        return null;
    }

    if (!accessKey) {
        logger.error(
            `${moduleName}: Cannot Initialize : undefined or invalid accessKey.`
        );
        return null;
    }

    if (!secretKey) {
        logger.error(
            `${moduleName}: Cannot Initialize : undefined or invalid secretKey.`
        );
        return null;
    }

    return new MinioHelper(accessKey, secretKey, endPoint);
};

export type InitializationParams = {
    endPoint: string;
    accessKey: string;
    secretKey: string;
};

module.exports = { initialize };
