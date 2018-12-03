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
const responseCodes = require("../constants/minio");
const isValidString = require("../validators/string.validator").isValidString;
const isValidNonEmptyArray = require("../validators/array.validator")
    .isValidNonEmptyArray;
const Readable = require("stream").Readable;
class MinioHelper {
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
    isInitialized() {
        return this._isInitialized;
    }
    createBucket(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
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
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL);
                logger.success(`${this._className}.removeBucket: ${successResponse.name}`);
                return resolve(successResponse);
            });
        }));
    }
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
    putObject(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName, filePath } = params;
            let { dirName = "./" } = params;
            if (!isValidString(bucketName) || !isValidString(filePath)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            if (!fs.existsSync(filePath)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.FILE_DOES_NOT_EXIST, responseCodes.ERRORS.FILE_DOES_NOT_EXIST);
                logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            if (!dirName.endsWith("/")) {
                dirName = `${dirName}/`;
            }
            const fileStream = fs.createReadStream(filePath);
            const fileName = path.basename(filePath);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_READING_FILE, responseCodes.ERRORS.ERROR_READING_FILE, err);
                    logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                this._minioClient.putObject(bucketName, `${dirName}${fileName}`, fileStream, stats.size, (err, etag) => {
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
    putStringObject(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName, fileName, data } = params;
            let { dirName = "./" } = params;
            if (!isValidString(bucketName) ||
                !isValidString(fileName) ||
                !isValidString(data)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.putStringObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            if (!dirName.endsWith("/")) {
                dirName = `${dirName}/`;
            }
            const dataStream = new Readable();
            dataStream.push(data);
            dataStream.push(null);
            this._minioClient.putObject(bucketName, `${dirName}${fileName}`, data, (error, etag) => {
                if (error) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_UPLOADING_STRING_OBJECT, responseCodes.ERRORS.ERROR_UPLOADING_STRING_OBJECT, error);
                    logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                if (etag) {
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.STRING_OBJECT_UPLOAD_SUCCESSFULL, responseCodes.INFO.STRING_OBJECT_UPLOAD_SUCCESSFULL, etag);
                    logger.success(`${this._className}.putObject: ${successResponse.name}`);
                    return resolve(successResponse);
                }
            });
        });
    }
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
    removeObject(params) {
        return new Q.Promise((resolve, reject) => { });
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluaW9IZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbWluaW8vTWluaW9IZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLHdFQUFxRTtBQUNyRSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLGFBQWEsQ0FBQztBQUM5RSxNQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQztLQUNoRSxvQkFBb0IsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBRTVDLE1BQWEsV0FBVztJQVlwQixZQUFZLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxRQUFnQjtRQVgxRCxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxlQUFVLEdBQUcsYUFBYSxDQUFDO1FBVy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2pDLFFBQVE7WUFDUixNQUFNLEVBQUUsSUFBSTtZQUNaLFNBQVM7WUFDVCxTQUFTO1NBQ1osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDL0IsQ0FBQztJQVFNLGFBQWE7UUFDaEIsT0FBTyxJQUFJLENB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