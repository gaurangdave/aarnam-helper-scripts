import { ServiceResponse } from "../serviceResponse/ServiceResponse";
export declare class MinioHelper {
    private _isInitialized;
    private _className;
    private _minioClient;
    private _logger;
    constructor(accessKey: string, secretKey: string, endPoint: string);
    isInitialized(): Boolean;
    createBucket(params: BucketNameParams): Promise<ServiceResponse>;
    getBucketList(): Promise<ServiceResponse>;
    removeBucket(params: BucketNameParams): Promise<ServiceResponse>;
    emptyBucket(params: BucketNameParams): Promise<ServiceResponse>;
    listObjects(params: BucketNameParams): Promise<ServiceResponse>;
    putObject(params: PutObjectParams): Promise<ServiceResponse>;
    putStringObject(params: PutStringParams): Promise<ServiceResponse>;
    getObject(params: FileNameParams): Promise<ServiceResponse>;
    removeObject(params: FileNameParams): Promise<ServiceResponse>;
    bucketExists(params: BucketNameParams): Promise<ServiceResponse>;
}
export declare type BucketNameParams = {
    bucketName: string;
};
export declare type PutObjectParams = {
    bucketName: string;
    filePath: string;
    dirName?: string;
};
export declare type PutStringParams = {
    bucketName: string;
    fileName: string;
    dirName?: string;
    data: string;
};
export declare type FileNameParams = {
    bucketName: string;
    fileName: string;
};
