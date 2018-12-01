import { ServiceResponse } from "../../serviceResponse/ServiceResponse";
export declare class GoogleStorageHelper {
    private _storage;
    private _className;
    constructor(keyFilename: string, projectId: string);
    createBucket(params: CreateBucketParams): Promise<ServiceResponse>;
    getBucketList(): Promise<ServiceResponse>;
    removeBucket(params: BucketNameParams): Promise<ServiceResponse>;
    emptyBucket(params: BucketNameParams): Promise<ServiceResponse>;
    bucketExists(params: BucketNameParams): Promise<ServiceResponse>;
    putObject(params: PutObjectParams): Promise<ServiceResponse>;
    listObjects(params: BucketNameParams): Promise<ServiceResponse>;
    getObject(params: FileNameParams): Promise<ServiceResponse>;
    removeObject(params: FileNameParams): Promise<ServiceResponse>;
}
export declare type CreateBucketParams = {
    bucketName: string;
    isBucketPublic: boolean;
    areFilesPublic: boolean;
};
export declare type BucketNameParams = {
    bucketName: string;
};
export declare type PutObjectParams = {
    bucketName: string;
    filePath: string;
    isPublic: boolean;
    dirName?: string;
};
export declare type FileNameParams = {
    bucketName: string;
    fileName: string;
};
