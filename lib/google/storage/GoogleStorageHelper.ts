// Imports the Google Cloud client library.
import { Bucket, Storage } from "@google-cloud/storage";
import { ServiceResponse } from "../../serviceResponse/ServiceResponse";

const path = require("path");
const logger = require("../../logger");
const fs = require("fs");
const Q = require("q");

const responseCodes = require("../../constants/google");
const isValidString = require("../../validators/string.validator")
    .isValidString;

export class GoogleStorageHelper {
    private _storage: Storage;
    private _className = "GoogleStorageHelper";

    constructor(keyFilename: string, projectId: string) {
        this._storage = new Storage({
            keyFilename,
            projectId
        });
    }

    /**
     *
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    public createBucket(params: CreateBucketParams): Promise<ServiceResponse> {
        return new Q.Promise(async (resolve: Function, reject: Function) => {
            const {
                bucketName,
                isBucketPublic = false,
                areFilesPublic = false
            } = params;

            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING,
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING
                );
                logger.error(
                    `${this._className}.createBucket: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            let existingBucket = false;
            try {
                existingBucket = (await this.bucketExists({ bucketName })).data;
            } catch (bucketExistsError) {
                return reject(bucketExistsError);
            }

            if (existingBucket) {
                const successResponse = ServiceResponse.createWarningResponse(
                    responseCodes.INFO.BUCKET_EXISTS,
                    responseCodes.INFO.BUCKET_EXISTS,
                    existingBucket
                );
                logger.success(
                    `${this._className}.createBucket: ${successResponse.name}`
                );
                return resolve(successResponse);
            }

            const newBucket = this._storage.bucket(bucketName);
            newBucket.create(async (makeBucketError: Error, bucket: Bucket) => {
                if (makeBucketError) {
                    const errorResponse = ServiceResponse.createErrorResponse(
                        responseCodes.ERRORS.ERROR_CREATING_BUCKET,
                        responseCodes.ERRORS.ERROR_CREATING_BUCKET,
                        makeBucketError
                    );
                    logger.error(
                        `${this._className}.createBucket: ${errorResponse.name}`
                    );
                    return reject(errorResponse);
                }

                if (isBucketPublic) {
                    const options = {
                        includeFiles: areFilesPublic
                    };
                    await bucket.makePublic(options);
                }

                const successResponse = ServiceResponse.createSuccessResponse(
                    responseCodes.INFO.CREATE_BUCKET_SUCCESSFULL,
                    responseCodes.INFO.CREATE_BUCKET_SUCCESSFULL
                );
                logger.success(
                    `${this._className}.createBucket: ${successResponse.name}`
                );
                return resolve(successResponse);
            });
        });
    }

    /**
     *
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    public getBucketList(): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
            this._storage.getBuckets(
                (getBucketsError: Error, data: Bucket[]) => {
                    if (getBucketsError) {
                        const errorResponse = ServiceResponse.createErrorResponse(
                            responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST,
                            responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST,
                            getBucketsError
                        );
                        logger.error(
                            `${this._className}.getBucketList: ${
                                errorResponse.name
                            }`,
                            getBucketsError
                        );
                        return reject(getBucketsError);
                    }

                    const successResponse = ServiceResponse.createSuccessResponse(
                        responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL,
                        responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL,
                        data
                    );
                    logger.success(
                        `${this._className}.getBucketList: ${
                            successResponse.name
                        }`
                    );
                    return resolve(successResponse);
                }
            );
        });
    }

    /**
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    public removeBucket(params: BucketNameParams): Promise<ServiceResponse> {
        return new Promise((resolve: Function, reject: Function) => {
            const { bucketName } = params;

            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING,
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING
                );
                logger.error(
                    `${this._className}.removeBucket: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            const bucket: Bucket = this._storage.bucket(bucketName);
            bucket.delete().then(
                response => {
                    const successResponse = ServiceResponse.createSuccessResponse(
                        responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL,
                        responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL,
                        response
                    );
                    logger.success(
                        `${this._className}.removeBucket: ${
                            successResponse.name
                        }`
                    );
                    return resolve(successResponse);
                },
                (deleteError: Error) => {
                    const errorResponse = ServiceResponse.createErrorResponse(
                        responseCodes.ERRORS.ERROR_REMOVING_BUCKET,
                        responseCodes.ERRORS.ERROR_REMOVING_BUCKET,
                        deleteError
                    );
                    logger.error(
                        `${this._className}.removeBucket: ${errorResponse.name}`
                    );
                    return reject(errorResponse);
                }
            );
        });
    }

    public emptyBucket(params: BucketNameParams): Promise<ServiceResponse> {
        return new Promise((resolve: Function, reject: Function) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING,
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING
                );
                logger.error(
                    `${this._className}.emptyBucket: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            const bucket: Bucket = this._storage.bucket(bucketName);
            const options = { force: true }; // flag to suppress errors till all files have been processed.
            bucket.deleteFiles(options).then(
                () => {
                    const successResponse = ServiceResponse.createSuccessResponse(
                        responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL,
                        responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL
                    );

                    logger.success(
                        `${this._className}.emptyBucket: ${
                            successResponse.name
                        }`
                    );

                    return resolve(successResponse);
                },
                (deleteFilesError: Error) => {
                    const errorResponse = ServiceResponse.createErrorResponse(
                        responseCodes.ERRORS.ERROR_REMOVING_MULTIPLE_OBJECTS,
                        responseCodes.ERRORS.ERROR_REMOVING_MULTIPLE_OBJECTS,
                        deleteFilesError
                    );

                    logger.error(
                        `${this._className}.emptyBucket:${errorResponse.name}`,
                        deleteFilesError
                    );

                    return reject(errorResponse);
                }
            );
        });
    }

    /**
     *
     *
     * @param {string} bucketName
     * @returns {Promise<boolean>}
     * @memberof GoogleStorageHelper
     */
    public bucketExists(params: BucketNameParams): Promise<ServiceResponse> {
        return new Q.Promise(async (resolve: Function, reject: Function) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING,
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING
                );
                logger.error(
                    `${this._className}.bucketExists: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            const bucket = this._storage.bucket(bucketName);

            bucket.exists(
                (error: Error | null, exists: Boolean | undefined) => {
                    if (error) {
                        const errorResponse = ServiceResponse.createErrorResponse(
                            responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS,
                            responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS,
                            error
                        );
                        logger.error(
                            `${this._className}.bucketExists: ${
                                errorResponse.name
                            }`
                        );
                        return reject(errorResponse);
                    }

                    const successResponse = ServiceResponse.createSuccessResponse(
                        responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL,
                        responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL,
                        exists
                    );

                    logger.success(
                        `${this._className}.bucketExists: ${
                            successResponse.name
                        }`
                    );

                    return resolve(successResponse);
                }
            );
        });
    }

    /**
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    public putObject(params: PutObjectParams): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
            const { bucketName, filePath, isPublic = false } = params;
            let { dirName = "./" } = params;

            if (!isValidString(bucketName) || !isValidString(filePath)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING,
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING
                );
                logger.error(
                    `${this._className}.putObject: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            // check if file exists
            if (!fs.existsSync(filePath)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.FILE_DOES_NOT_EXIST,
                    responseCodes.ERRORS.FILE_DOES_NOT_EXIST
                );

                logger.error(
                    `${this._className}.putObject: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            if (!dirName.endsWith("/")) {
                dirName = `${dirName}/`;
            }

            const options = {
                public: isPublic,
                gzip: "auto",
                contentType: "auto"
            };

            const fileName = path.basename(filePath);
            const bucket = this._storage.bucket(bucketName);
            const file = bucket.file(`${dirName}${fileName}`);
            fs.createReadStream(filePath)
                .pipe(file.createWriteStream(options))
                .on("error", (error: Error) => {
                    const errorResponse = ServiceResponse.createErrorResponse(
                        responseCodes.ERRORS.ERROR_UPLOADING_FILE,
                        responseCodes.ERRORS.ERROR_UPLOADING_FILE,
                        error
                    );

                    logger.error(
                        `${this._className}.putObject: ${errorResponse.name}`
                    );
                    return reject(errorResponse);
                })
                .on("finish", () => {
                    const successResponse = ServiceResponse.createSuccessResponse(
                        responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL,
                        responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL
                    );
                    logger.success(
                        `${this._className}.putObject: ${successResponse.name}`
                    );
                    return resolve(successResponse);
                });
        });
    }

    public listObjects(params: BucketNameParams): Promise<ServiceResponse> {
        return new Promise((resolve: Function, reject: Function) => {
            const { bucketName } = params;
        });
    }

    public getObject(params: FileNameParams): Promise<ServiceResponse> {
        return new Promise((resolve: Function, reject: Function) => {
            const { bucketName, fileName } = params;
        });
    }

    public removeObject(params: FileNameParams): Promise<ServiceResponse> {
        return new Promise((resolve: Function, reject: Function) => {
            const { bucketName, fileName } = params;
        });
    }
}

export type CreateBucketParams = {
    bucketName: string;
    isBucketPublic: boolean;
    areFilesPublic: boolean;
};

export type BucketNameParams = {
    bucketName: string;
};

export type PutObjectParams = {
    bucketName: string;
    filePath: string;
    isPublic: boolean;
    dirName?: string;
};

export type FileNameParams = {
    bucketName: string;
    fileName: string;
};
