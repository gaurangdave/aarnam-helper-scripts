"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Minio = require("minio");
const Q = require("q");
const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const ServerResponse = require("../serviceResponse/ServiceResponse");
const responseCodes = require("../constants/minio.json");
const isValidString = require("../validators/string.validator").isValidString;
const isValidNonEmptyArray = require("../validators/array.validator")
    .isValidNonEmptyArray;
class MinioHelper {
    /**
     * Creates an instance of MinioHelper.
     * @param {string} accessKey
     * @param {string} secretKey
     * @param {string} endPoint
     * @memberof MinioHelper
     */
    constructor(accessKey, secretKey, endPoint) {
        this._isInitialized = false;
        this._className = "MinioHelper";
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
    isInitialized() {
        return this._isInitialized;
    }
    /**
     *
     * Function to get list of buckets in Minio
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    getBucketList() {
        return new Q.Promise((resolve, reject) => {
            if (!this.isInitialized()) {
                const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.MINIO_CLIENT_NOT_INITIALIZED);
                logger.error(`${this._className}.getBucketList: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.listBuckets().then((data) => {
                const successResponse = ServerResponse.createSuccessResponse(responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, data);
                logger.success(`${this._className}.getBucketList: ${successResponse.name}`);
                return resolve(successResponse);
            }, (error) => {
                const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, error);
                logger.error(`${this._className}.getBucketList: ${errorResponse.name}`, error);
                return reject(error);
            });
        });
    }
    /**
     *
     * Function to put an obect to the bucket.
     * @param {string} bucket
     * @param {string} filePath
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    putObject(bucket, filePath) {
        return new Q.Promise((resolve, reject) => {
            // check if file exists
            if (!fs.existsSync(filePath)) {
                const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.FILE_DOES_NOT_EXIST, responseCodes.ERRORS.FILE_DOES_NOT_EXIST);
                logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const fileStream = fs.createReadStream(filePath);
            const fileName = path.basename(filePath);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.ERROR_READING_FILE, responseCodes.ERRORS.ERROR_READING_FILE, err);
                    logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                this._minioClient.putObject(bucket, fileName, fileStream, stats.size, (err, etag) => {
                    if (err) {
                        const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.ERROR_UPLOADING_FILE, responseCodes.ERRORS.ERROR_UPLOADING_FILE, err);
                        logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                        return reject(errorResponse);
                    }
                    if (etag) {
                        const successResponse = ServerResponse.createSuccessResponse(responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, etag);
                        logger.success(`${this._className}.putObject: ${successResponse.name}`);
                        return resolve(successResponse);
                    }
                });
            });
        });
    }
    /**
     *
     * Function to create a bucket if not existing
     * @param {string} bucket
     * @returns {Promise<boolean>}
     * @memberof MinioHelper
     */
    createBucket(bucket) {
        return new Q.Promise((resolve, reject) => {
            // TODO validate bucket param
            // check if bucket exists or not.
            this._minioClient.bucketExists(bucket, (bucketExistsError, exists) => {
                if (bucketExistsError) {
                    const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, bucketExistsError);
                    logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                if (!exists) {
                    this._minioClient.makeBucket(bucket, "", (makeBucketError) => {
                        if (makeBucketError) {
                            const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS
                                .ERROR_CREATING_BUCKET, responseCodes.ERRORS
                                .ERROR_CREATING_BUCKET, makeBucketError);
                            logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                            return reject(errorResponse);
                        }
                        else {
                            const successResponse = ServerResponse.createSuccessResponse(responseCodes.INFO
                                .CREATE_BUCKET_SUCCESSFULL, responseCodes.INFO
                                .CREATE_BUCKET_SUCCESSFULL);
                            logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                            return resolve(successResponse);
                        }
                    });
                }
                else {
                    const successResponse = ServerResponse.createWarningResponse(responseCodes.INFO.BUCKET_EXISTS, responseCodes.INFO.BUCKET_EXISTS);
                    logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                    return resolve(successResponse);
                }
            });
        });
    }
    /**
     *
     * Function to get object from buckets
     * @param {string} bucket
     * @param {string} fileName
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    getObject(bucket, fileName) {
        return new Q.Promise((resolve, reject) => { });
    }
    /**
     *
     * Function to delete bucket
     * @param {string} bucket
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    removeBucket(bucket) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!isValidString(bucket)) {
                const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            try {
                yield this.emptyBucket(bucket);
            }
            catch (emptyBucketError) {
                return reject(emptyBucketError);
            }
            this._minioClient.removeBucket(bucket, (bucketRemoveError) => {
                if (bucketRemoveError) {
                    const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.ERROR_REMOVING_BUCKET, responseCodes.ERRORS.ERROR_REMOVING_BUCKET, bucketRemoveError);
                    logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                // TODO resolve with success.
                const successResponse = ServerResponse.createSuccessResponse(responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL);
                logger.success(`${this._className}.removeBucket: ${successResponse.name}`);
                return resolve(successResponse);
            });
        }));
    }
    /**
     *
     * Function to remove object from bucket.
     * @param {string} bucket
     * @param {string} fileName
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    removeObject(bucket, fileName) {
        return new Q.Promise((resolve, reject) => { });
    }
    /**
     *
     * Function to empty a given bucket.
     * @param {string} bucket
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    emptyBucket(bucket) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!isValidString(bucket)) {
                const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this.listObjects(bucket).then((resp) => {
                const { data: bucketObjects } = resp;
                if (!isValidNonEmptyArray(bucketObjects)) {
                    //resolve to bucket empty status.
                    const successResponse = ServerResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
                    logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
                    return resolve(successResponse);
                }
                const objectNames = bucketObjects.map((obj) => {
                    return obj.name;
                });
                this._minioClient.removeObjects(bucket, objectNames, (removeObjectError) => {
                    if (removeObjectError) {
                        const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS
                            .ERROR_REMOVING_MULTIPLE_OBJECTS, responseCodes.ERRORS
                            .ERROR_REMOVING_MULTIPLE_OBJECTS, removeObjectError);
                        logger.error(`${this._className}.emptyBucket:${errorResponse.name}`, removeObjectError);
                        return reject(errorResponse);
                    }
                    const successResponse = ServerResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
                    logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
                    return resolve(successResponse);
                });
            }, error => {
                return reject(error);
            });
        }));
    }
    /**
     *
     * Function to list all the objects in a bucket.
     * @param {string} bucket
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    listObjects(bucket) {
        return new Q.Promise((resolve, reject) => {
            if (!isValidString(bucket)) {
                const errorResponse = ServerResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const objectList = [];
            var stream = this._minioClient.listObjects(bucket, "", true);
            stream.on("data", (obj) => {
                objectList.push(obj);
            });
            stream.on("error", (err) => {
                logger.error(`${this._className}.listObjects: ${responseCodes.ERRORS.ERROR_GETTING_OBJECT_LIST}`);
            });
            stream.on("end", () => {
                const successResponse = ServerResponse.createSuccessResponse(responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL, responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL, objectList);
                return resolve(successResponse);
            });
        });
    }
    /**
     *
     * Function to check if bucket exists or not.
     * @param {string} bucket
     * @returns {Promise<any>}
     * @memberof MinioHelper
     */
    bucketExists(bucket) {
        return new Q.Promise((resolve, reject) => { });
    }
}
module.exports = MinioHelper;
