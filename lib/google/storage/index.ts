import { GoogleStorageHelper } from "./GoogleStorageHelper";
import { Logger } from "../../logger";

const moduleName = "GoogleStorageHelper";

/**
 * Function to instantiate a client by passing key file and project id.
 * @param {*} params
 */
export const initialize = (
    params: InitializationParams
): GoogleStorageHelper | null => {
    const { keyFilePath, projectId } = params;
    const lg = new Logger();

    if (!keyFilePath) {
        lg.error(
            `${moduleName}: Cannot Initialize : undefined or invalid key file.`
        );
        return null;
    }

    if (!projectId) {
        lg.error(
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
