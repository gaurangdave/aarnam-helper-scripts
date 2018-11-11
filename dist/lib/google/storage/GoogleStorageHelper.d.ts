import { ServiceResponse } from "../../serviceResponse/ServiceResponse";
export declare class GoogleStorageHelper {
    private _storage;
    private _className;
    constructor(keyFilename: string, projectId: string);
    createBucket(params: any): Promise<ServiceResponse>;
    getBucketList(): Promise<ServiceResponse>;
    removeBucket(params: any): Promise<ServiceResponse>;
    emptyBucket(params: any): Promise<ServiceResponse>;
    bucketExists(params: any): Promise<ServiceResponse>;
    putObject(params: any): Promise<ServiceResponse>;
    listObjects(params: any): Promise<ServiceResponse>;
    getObject(params: any): Promise<ServiceResponse>;
    removeObject(params: any): Promise<ServiceResponse>;
}
