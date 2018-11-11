import { GoogleStorageHelper } from "./GoogleStorageHelper";
export declare const initialize: (params: InitializationParams) => GoogleStorageHelper | null;
export declare type InitializationParams = {
    keyFilePath: string;
    projectId: string;
};
