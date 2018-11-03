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
const ServiceResponse_1 = require("../serviceResponse/ServiceResponse");
const Minio = require("minio");
const Q = require("q");
const fs = require("fs");
const path = require("path");
const logger = require("../logger");
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
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    createBucket(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            // check if bucket exists or not.
            this._minioClient.bucketExists(bucketName, (bucketExistsError, exists) => {
                if (bucketExistsError) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, bucketExistsError);
                    logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                if (!exists) {
                    this._minioClient.makeBucket(bucketName, "", (makeBucketError) => {
                        if (makeBucketError) {
                            const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS
                                .ERROR_CREATING_BUCKET, responseCodes.ERRORS
                                .ERROR_CREATING_BUCKET, makeBucketError);
                            logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                            return reject(errorResponse);
                        }
                        else {
                            const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO
                                .CREATE_BUCKET_SUCCESSFULL, responseCodes.INFO
                                .CREATE_BUCKET_SUCCESSFULL);
                            logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                            return resolve(successResponse);
                        }
                    });
                }
                else {
                    const successResponse = ServiceResponse_1.ServiceResponse.createWarningResponse(responseCodes.INFO.BUCKET_EXISTS, responseCodes.INFO.BUCKET_EXISTS);
                    logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                    return resolve(successResponse);
                }
            });
        });
    }
    /**
     *
     *
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    getBucketList() {
        return new Q.Promise((resolve, reject) => {
            if (!this.isInitialized()) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.MINIO_CLIENT_NOT_INITIALIZED);
                logger.error(`${this._className}.getBucketList: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.listBuckets().then((data) => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, data);
                logger.success(`${this._className}.getBucketList: ${successResponse.name}`);
                return resolve(successResponse);
            }, (error) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, error);
                logger.error(`${this._className}.getBucketList: ${errorResponse.name}`, error);
                return reject(error);
            });
        });
    }
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    removeBucket(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            try {
                yield this.emptyBucket({ bucketName });
            }
            catch (emptyBucketError) {
                return reject(emptyBucketError);
            }
            this._minioClient.removeBucket(bucketName, (bucketRemoveError) => {
                if (bucketRemoveError) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_REMOVING_BUCKET, responseCodes.ERRORS.ERROR_REMOVING_BUCKET, bucketRemoveError);
                    logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                // TODO resolve with success.
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL);
                logger.success(`${this._className}.removeBucket: ${successResponse.name}`);
                return resolve(successResponse);
            });
        }));
    }
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    emptyBucket(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this.listObjects({ bucketName }).then((resp) => {
                const { data: bucketObjects } = resp;
                if (!isValidNonEmptyArray(bucketObjects)) {
                    //resolve to bucket empty status.
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
                    logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
                    return resolve(successResponse);
                }
                const objectNames = bucketObjects.map((obj) => {
                    return obj.name;
                });
                this._minioClient.removeObjects(bucketName, objectNames, (removeObjectError) => {
                    if (removeObjectError) {
                        const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS
                            .ERROR_REMOVING_MULTIPLE_OBJECTS, responseCodes.ERRORS
                            .ERROR_REMOVING_MULTIPLE_OBJECTS, removeObjectError);
                        logger.error(`${this._className}.emptyBucket:${errorResponse.name}`, removeObjectError);
                        return reject(errorResponse);
                    }
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
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
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    listObjects(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const objectList = [];
            var stream = this._minioClient.listObjects(bucketName, "", true);
            stream.on("data", (obj) => {
                objectList.push(obj);
            });
            stream.on("error", (err) => {
                logger.error(`${this._className}.listObjects: ${responseCodes.ERRORS.ERROR_GETTING_OBJECT_LIST}`);
            });
            stream.on("end", () => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL, responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL, objectList);
                logger.success(`${this._className}.listObjects: ${successResponse.name}`);
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
    putObject(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName, filePath } = params;
            if (!isValidString(bucketName) || !isValidString(filePath)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            // check if file exists
            if (!fs.existsSync(filePath)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.FILE_DOES_NOT_EXIST, responseCodes.ERRORS.FILE_DOES_NOT_EXIST);
                logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const fileStream = fs.createReadStream(filePath);
            const fileName = path.basename(filePath);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_READING_FILE, responseCodes.ERRORS.ERROR_READING_FILE, err);
                    logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                this._minioClient.putObject(bucketName, fileName, fileStream, stats.size, (err, etag) => {
                    if (err) {
                        const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_UPLOADING_FILE, responseCodes.ERRORS.ERROR_UPLOADING_FILE, err);
                        logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                        return reject(errorResponse);
                    }
                    if (etag) {
                        const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, etag);
                        logger.success(`${this._className}.putObject: ${successResponse.name}`);
                        return resolve(successResponse);
                    }
                });
            });
        });
    }
    /**
     *
     * @param {FileNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    getObject(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName, fileName } = params;
            if (!isValidString(bucketName) || !isValidString(fileName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.getObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.getObject(bucketName, fileName, (error, dataStream) => {
                if (error) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_GETTING_OBJECT, responseCodes.ERRORS.ERROR_GETTING_OBJECT, error);
                    logger.error(`${this._className}.getObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                let fileData = "";
                dataStream.setEncoding("utf8");
                dataStream.on("data", (chunk) => {
                    fileData += chunk;
                });
                dataStream.on("end", () => {
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_OBJECT_SUCCESSFULL, responseCodes.INFO.GET_OBJECT_SUCCESSFULL, fileData);
                    logger.success(`${this._className}.getObject: ${successResponse.name}`);
                    return resolve(successResponse);
                });
                dataStream.on("error", (err) => {
                    return reject(err);
                });
            });
        });
    }
    /**
     *
     * @param {FileNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    removeObject(params) {
        return new Q.Promise((resolve, reject) => { });
    }
    /**
     *
     * @param {BucketNameParams} params
     * @returns {Promise<ServiceResponse>}
     * @memberof MinioHelper
     */
    bucketExists(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.bucketExists(bucketName, (error, exists) => {
                if (error) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, error);
                    logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, exists);
                logger.success(`${this._className}.bucketExists: ${successResponse.name}`);
                return resolve(successResponse);
            });
        });
    }
}
exports.MinioHelper = MinioHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluaW9IZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJNaW5pb0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBR0Esd0VBQXFFO0FBQ3JFLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDekQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsYUFBYSxDQUFDO0FBQzlFLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDO0tBQ2hFLG9CQUFvQixDQUFDO0FBRTFCLE1BQWEsV0FBVztJQUtwQjs7Ozs7O09BTUc7SUFDSCxZQUFZLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxRQUFnQjtRQVgxRCxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxlQUFVLEdBQUcsYUFBYSxDQUFDO1FBVy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2pDLFFBQVE7WUFDUixNQUFNLEVBQUUsSUFBSTtZQUNaLFNBQVM7WUFDVCxTQUFTO1NBQ1osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksYUFBYTtRQUNoQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksWUFB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