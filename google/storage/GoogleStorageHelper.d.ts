import { ServiceResponse } from "../../serviceResponse/ServiceResponse";
export declare class GoogleStorageHelper {
    private _storage;
    private _className;
    constructor(keyFilename: string, projectId: string);
    /**
     *
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    createBucket(params: any): Promise<ServiceResponse>;
    /**
     *
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    getBucketList(): Promise<ServiceResponse>;
    /**
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    removeBucket(params: any): Promise<ServiceResponse>;
    emptyBucket(params: any): Promise<ServiceResponse>;
    /**
     *
     *
     * @param {string} bucketName
     * @returns {Promise<boolean>}
     * @memberof GoogleStorageHelper
     */
    bucketExists(params: any): Promise<boolean>;
    listObjects(params: any): Promise<ServiceResponse>;
    /**
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    putObject(params: any): Promise<ServiceResponse>;
    getObject(params: any): Promise<ServiceResponse>;
    removeObject(params: any): Promise<ServiceResponse>;
}
