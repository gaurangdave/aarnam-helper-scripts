import { GoogleStorageHelper } from "./GoogleStorageHelper";

// Imports the Google Cloud client library.
const logger = require("../../logger");
const moduleName = "GoogleStorageHelper";

/**
 * Function to instantiate a client by passing key file and project id.
 * @param {*} params
 */
export const initialize = (
    params: InitializationParams
): GoogleStorageHelper | null => {
    const { keyFilePath, projectId } = params;

    if (!keyFilePath) {
        logger.error(
            `${moduleName}: Cannot Initialize : undefined or invalid key file.`
        );
        return null;
    }

    if (!projectId) {
        logger.error(
            `${moduleName}: Cannot Initialize : undefined or invalid projectId.`
        );
        return null;
    }

    return new GoogleStorageHelper(keyFilePath, projectId);
};

export type InitializationParams = {
    keyFilePath: string;
    projectId: string;
};

module.exports = {
    initialize
};
