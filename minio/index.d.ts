import { MinioHelper } from "./MinioHelper";
/**
 *
 * @param params
 */
export declare const initialize: (params: InitializationParams) => MinioHelper | null;
export declare type InitializationParams = {
    endPoint: string;
    accessKey: string;
    secretKey: string;
};
