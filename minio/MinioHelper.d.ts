import { ServiceResponse } from "../serviceResponse/ServiceResponse";
export declare class MinioHelper {
    private _isInitialized;
    private _className;
    private _minioClient;
    /**
     * Creates an instance of MinioHelper.
     * @param {string} accessKey
     * @param {string} secretKey
     * @param {string} endPoint
     * @memberof MinioHelper
     */
    constructor(accessKey: string, secretKey: string, endPoint: string);
    /**
     *
     * Function to check if helper is initialized or not.
     * @returns {Boolean}
     * @memberof MinioHelper
     */
    isInitialized(): Boolean;
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    createBucket(params: BucketNameParams): Promise<ServiceResponse>;
    /**
     *
     *
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    getBucketList(): Promise<ServiceResponse>;
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    removeBucket(params: BucketNameParams): Promise<ServiceResponse>;
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    emptyBucket(params: BucketNameParams): Promise<ServiceResponse>;
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    listObjects(params: BucketNameParams): Promise<ServiceResponse>;
    /**
     *
     * @param {PutObjectParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    putObject(params: PutObjectParams): Promise<ServiceResponse>;
    /**
     *
     * @param {FileNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    getObject(params: FileNameParams): Promise<ServiceResponse>;
    /**
     *
     * @param {FileNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    removeObject(params: FileNameParams): Promise<ServiceResponse>;
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    bucketExists(params: BucketNameParams): Promise<ServiceResponse>;
}
/**
 * @typedef {Object} BucketNameParams
 * @property {string} bucketName - Indicates bucket name
 */
export declare type BucketNameParams = {
    bucketName: string;
};
/**
 * @typedef {Object} PutObjectParams
 * @property {string} bucketName - Indicates bucket name
 * @property {string} filePath - Indicates file path
 */
export declare type PutObjectParams = {
    bucketName: string;
    filePath: string;
};
/**
 * @typedef {Object} PutObjectParams
 * @property {string} bucketName - Indicates bucket name
 * @property {string} fileName - Indicates file name
 */
export declare type FileNameParams = {
    bucketName: string;
    fileName: string;
};
