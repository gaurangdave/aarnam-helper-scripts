import { Client, BucketItemFromList, BucketItem, ResultCallback } from "minio";
import { Stats } from "fs";
import { Stream } from "stream";
import { ServiceResponse } from "../serviceResponse/ServiceResponse";
const Minio = require("minio");
const Q = require("q");
const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const responseCodes = require("../constants/minio");
const isValidString = require("../validators/string.validator").isValidString;
const isValidNonEmptyArray = require("../validators/array.validator")
    .isValidNonEmptyArray;

export class MinioHelper {
    private _isInitialized: boolean = false;
    private _className = "MinioHelper";
    private _minioClient: Client;

    /**
     * Creates an instance of MinioHelper.
     * @param {string} accessKey
     * @param {string} secretKey
     * @param {string} endPoint
     * @memberof MinioHelper
     */
    constructor(accessKey: string, secretKey: string, endPoint: string) {
        this._minioClient = new Minio.Client({
            endPoint,
            useSSL: true,
            accessKey,
            secretKey
        });

        this._isInitialized = true;
    }

    /**
     *
     * Function to check if helper is initialized or not.
     * @returns {Boolean}
     * @memberof MinioHelper
     */
    public isInitialized(): Boolean {
        return this._isInitialized;
    }

    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public createBucket(params: BucketNameParams): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
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

            // check if bucket exists or not.
            this._minioClient.bucketExists(
                bucketName,
                (bucketExistsError: Error | null, exists: Boolean) => {
                    if (bucketExistsError) {
                        const errorResponse = ServiceResponse.createErrorResponse(
                            responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS,
                            responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS,
                            bucketExistsError
                        );
                        logger.error(
                            `${this._className}.createBucket: ${
                                errorResponse.name
                            }`
                        );
                        return reject(errorResponse);
                    }

                    if (!exists) {
                        this._minioClient.makeBucket(
                            bucketName,
                            "",
                            (makeBucketError: any) => {
                                if (makeBucketError) {
                                    const errorResponse = ServiceResponse.createErrorResponse(
                                        responseCodes.ERRORS
                                            .ERROR_CREATING_BUCKET,
                                        responseCodes.ERRORS
                                            .ERROR_CREATING_BUCKET,
                                        makeBucketError
                                    );
                                    logger.error(
                                        `${this._className}.createBucket: ${
                                            errorResponse.name
                                        }`
                                    );
                                    return reject(errorResponse);
                                } else {
                                    const successResponse = ServiceResponse.createSuccessResponse(
                                        responseCodes.INFO
                                            .CREATE_BUCKET_SUCCESSFULL,
                                        responseCodes.INFO
                                            .CREATE_BUCKET_SUCCESSFULL
                                    );
                                    logger.success(
                                        `${this._className}.createBucket: ${
                                            successResponse.name
                                        }`
                                    );
                                    return resolve(successResponse);
                                }
                            }
                        );
                    } else {
                        const successResponse = ServiceResponse.createWarningResponse(
                            responseCodes.INFO.BUCKET_EXISTS,
                            responseCodes.INFO.BUCKET_EXISTS
                        );
                        logger.success(
                            `${this._className}.createBucket: ${
                                successResponse.name
                            }`
                        );
                        return resolve(successResponse);
                    }
                }
            );
        });
    }

    /**
     *
     *
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public getBucketList(): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
            if (!this.isInitialized()) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.MINIO_CLIENT_NOT_INITIALIZED
                );
                logger.error(
                    `${this._className}.getBucketList: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            this._minioClient.listBuckets().then(
                (data: BucketItemFromList[]) => {
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
                },
                (error: Error) => {
                    const errorResponse = ServiceResponse.createErrorResponse(
                        responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST,
                        responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST,
                        error
                    );
                    logger.error(
                        `${this._className}.getBucketList: ${
                            errorResponse.name
                        }`,
                        error
                    );
                    return reject(error);
                }
            );
        });
    }

    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public removeBucket(params: BucketNameParams): Promise<ServiceResponse> {
        return new Q.Promise(async (resolve: Function, reject: Function) => {
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

            try {
                await this.emptyBucket({ bucketName });
            } catch (emptyBucketError) {
                return reject(emptyBucketError);
            }

            this._minioClient.removeBucket(
                bucketName,
                (bucketRemoveError: Error | null) => {
                    if (bucketRemoveError) {
                        const errorResponse = ServiceResponse.createErrorResponse(
                            responseCodes.ERRORS.ERROR_REMOVING_BUCKET,
                            responseCodes.ERRORS.ERROR_REMOVING_BUCKET,
                            bucketRemoveError
                        );
                        logger.error(
                            `${this._className}.removeBucket: ${
                                errorResponse.name
                            }`
                        );
                        return reject(errorResponse);
                    }
                    // TODO resolve with success.
                    const successResponse = ServiceResponse.createSuccessResponse(
                        responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL,
                        responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL
                    );
                    logger.success(
                        `${this._className}.removeBucket: ${
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
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public emptyBucket(params: BucketNameParams): Promise<ServiceResponse> {
        return new Q.Promise(async (resolve: Function, reject: Function) => {
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
            this.listObjects({ bucketName }).then(
                (resp: ServiceResponse) => {
                    const { data: bucketObjects } = resp;

                    if (!isValidNonEmptyArray(bucketObjects)) {
                        //resolve to bucket empty status.
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
                    }

                    const objectNames = bucketObjects.map((obj: BucketItem) => {
                        return obj.name;
                    });

                    this._minioClient.removeObjects(
                        bucketName,
                        objectNames,
                        (removeObjectError: Error | null) => {
                            if (removeObjectError) {
                                const errorResponse = ServiceResponse.createErrorResponse(
                                    responseCodes.ERRORS
                                        .ERROR_REMOVING_MULTIPLE_OBJECTS,
                                    responseCodes.ERRORS
                                        .ERROR_REMOVING_MULTIPLE_OBJECTS,
                                    removeObjectError
                                );

                                logger.error(
                                    `${this._className}.emptyBucket:${
                                        errorResponse.name
                                    }`,
                                    removeObjectError
                                );

                                return reject(errorResponse);
                            }

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
                        }
                    );
                },
                error => {
                    return reject(error);
                }
            );
        });
    }

    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public listObjects(params: BucketNameParams): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
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
            const objectList: BucketItem[] = [];
            var stream: Stream = this._minioClient.listObjects(
                bucketName,
                "",
                true
            );

            stream.on("data", (obj: BucketItem) => {
                objectList.push(obj);
            });

            stream.on("error", (err: Error) => {
                logger.error(
                    `${this._className}.listObjects: ${
                        responseCodes.ERRORS.ERROR_GETTING_OBJECT_LIST
                    }`
                );
            });

            stream.on("end", () => {
                const successResponse = ServiceResponse.createSuccessResponse(
                    responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL,
                    responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL,
                    objectList
                );
                logger.success(
                    `${this._className}.listObjects: ${successResponse.name}`
                );
                return resolve(successResponse);
            });
        });
    }

    /**
     *
     * @param {PutObjectParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public putObject(params: PutObjectParams): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
            const { bucketName, filePath } = params;
            let { dirName = "./" } = params;

            if (!isValidString(bucketName) || !isValidString(filePath)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING,
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING
                );
                logger.error(
                    `${this._className}.removeBucket: ${errorResponse.name}`
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

            const fileStream = fs.createReadStream(filePath);
            const fileName = path.basename(filePath);

            fs.stat(filePath, (err: Error, stats: Stats) => {
                if (err) {
                    const errorResponse = ServiceResponse.createErrorResponse(
                        responseCodes.ERRORS.ERROR_READING_FILE,
                        responseCodes.ERRORS.ERROR_READING_FILE,
                        err
                    );

                    logger.error(
                        `${this._className}.putObject: ${errorResponse.name}`
                    );
                    return reject(errorResponse);
                }

                this._minioClient.putObject(
                    bucketName,
                    `${dirName}${fileName}`,
                    fileStream,
                    stats.size,
                    (err, etag) => {
                        if (err) {
                            const errorResponse = ServiceResponse.createErrorResponse(
                                responseCodes.ERRORS.ERROR_UPLOADING_FILE,
                                responseCodes.ERRORS.ERROR_UPLOADING_FILE,
                                err
                            );

                            logger.error(
                                `${this._className}.putObject: ${
                                    errorResponse.name
                                }`
                            );
                            return reject(errorResponse);
                        }

                        if (etag) {
                            const successResponse = ServiceResponse.createSuccessResponse(
                                responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL,
                                responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL,
                                etag
                            );
                            logger.success(
                                `${this._className}.putObject: ${
                                    successResponse.name
                                }`
                            );
                            return resolve(successResponse);
                        }
                    }
                );
            });
        });
    }

    /**
     *
     * @param {FileNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public getObject(params: FileNameParams): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
            const { bucketName, fileName } = params;

            if (!isValidString(bucketName) || !isValidString(fileName)) {
                const errorResponse = ServiceResponse.createErrorResponse(
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING,
                    responseCodes.ERRORS.REQUIRED_PARAM_MISSING
                );
                logger.error(
                    `${this._className}.getObject: ${errorResponse.name}`
                );
                return reject(errorResponse);
            }

            this._minioClient.getObject(
                bucketName,
                fileName,
                (error: Error | null, dataStream: any) => {
                    if (error) {
                        const errorResponse = ServiceResponse.createErrorResponse(
                            responseCodes.ERRORS.ERROR_GETTING_OBJECT,
                            responseCodes.ERRORS.ERROR_GETTING_OBJECT,
                            error
                        );
                        logger.error(
                            `${this._className}.getObject: ${
                                errorResponse.name
                            }`
                        );
                        return reject(errorResponse);
                    }
                    let fileData = "";
                    dataStream.setEncoding("utf8");

                    dataStream.on("data", (chunk: string) => {
                        fileData += chunk;
                    });

                    dataStream.on("end", () => {
                        const successResponse = ServiceResponse.createSuccessResponse(
                            responseCodes.INFO.GET_OBJECT_SUCCESSFULL,
                            responseCodes.INFO.GET_OBJECT_SUCCESSFULL,
                            fileData
                        );

                        logger.success(
                            `${this._className}.getObject: ${
                                successResponse.name
                            }`
                        );
                        return resolve(successResponse);
                    });

                    dataStream.on("error", (err: Error) => {
                        return reject(err);
                    });
                }
            );
        });
    }

    /**
     *
     * @param {FileNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public removeObject(params: FileNameParams): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {});
    }

    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    public bucketExists(params: BucketNameParams): Promise<ServiceResponse> {
        return new Q.Promise((resolve: Function, reject: Function) => {
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

            this._minioClient.bucketExists(
                bucketName,
                (error: Error | null, exists: Boolean) => {
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
}

/**
 * @typedef {Object} BucketNameParams
 * @property {string} bucketName - Indicates bucket name
 */
export type BucketNameParams = { bucketName: string };

/**
 * @typedef {Object} PutObjectParams
 * @property {string} bucketName - Indicates bucket name
 * @property {string} filePath - Indicates file path
 */
export type PutObjectParams = {
    bucketName: string;
    filePath: string;
    dirName?: string | "./";
};

/**
 * @typedef {Object} PutObjectParams
 * @property {string} bucketName - Indicates bucket name
 * @property {string} fileName - Indicates file name
 */
export type FileNameParams = { bucketName: string; fileName: string };
