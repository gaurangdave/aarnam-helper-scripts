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
const logger_1 = require("../logger");
const Minio = require("minio");
const Q = require("q");
const fs = require("fs");
const path = require("path");
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
        this._logger = new logger_1.Logger();
    }
    isInitialized() {
        return this._isInitialized;
    }
    createBucket(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                this._logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.bucketExists(bucketName, (bucketExistsError, exists) => {
                if (bucketExistsError) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, bucketExistsError);
                    this._logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                if (!exists) {
                    this._minioClient.makeBucket(bucketName, "", (makeBucketError) => {
                        if (makeBucketError) {
                            const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS
                                .ERROR_CREATING_BUCKET, responseCodes.ERRORS
                                .ERROR_CREATING_BUCKET, makeBucketError);
                            this._logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                            return reject(errorResponse);
                        }
                        else {
                            const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO
                                .CREATE_BUCKET_SUCCESSFULL, responseCodes.INFO
                                .CREATE_BUCKET_SUCCESSFULL);
                            this._logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                            return resolve(successResponse);
                        }
                    });
                }
                else {
                    const successResponse = ServiceResponse_1.ServiceResponse.createWarningResponse(responseCodes.INFO.BUCKET_EXISTS, responseCodes.INFO.BUCKET_EXISTS);
                    this._logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                    return resolve(successResponse);
                }
            });
        });
    }
    getBucketList() {
        return new Q.Promise((resolve, reject) => {
            if (!this.isInitialized()) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.MINIO_CLIENT_NOT_INITIALIZED);
                this._logger.error(`${this._className}.getBucketList: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.listBuckets().then((data) => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, data);
                this._logger.success(`${this._className}.getBucketList: ${successResponse.name}`);
                return resolve(successResponse);
            }, (error) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, error);
                this._logger.error(`${this._className}.getBucketList: ${errorResponse.name}`, error);
                return reject(error);
            });
        });
    }
    removeBucket(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                this._logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
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
                    this._logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL);
                this._logger.success(`${this._className}.removeBucket: ${successResponse.name}`);
                return resolve(successResponse);
            });
        }));
    }
    emptyBucket(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                this._logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this.listObjects({ bucketName }).then((resp) => {
                const { data: bucketObjects } = resp;
                if (!isValidNonEmptyArray(bucketObjects)) {
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
                    this._logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
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
                        this._logger.error(`${this._className}.emptyBucket:${errorResponse.name}`, removeObjectError);
                        return reject(errorResponse);
                    }
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
                    this._logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
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
                this._logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const objectList = [];
            var stream = this._minioClient.listObjects(bucketName, "", true);
            stream.on("data", (obj) => {
                objectList.push(obj);
            });
            stream.on("error", (err) => {
                this._logger.error(`${this._className}.listObjects: ${responseCodes.ERRORS.ERROR_GETTING_OBJECT_LIST}`);
            });
            stream.on("end", () => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL, responseCodes.INFO.GET_OBJECT_LIST_SUCCESSFULL, objectList);
                this._logger.success(`${this._className}.listObjects: ${successResponse.name}`);
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
                this._logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            if (!fs.existsSync(filePath)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.FILE_DOES_NOT_EXIST, responseCodes.ERRORS.FILE_DOES_NOT_EXIST);
                this._logger.error(`${this._className}.putObject: ${errorResponse.name}`);
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
                    this._logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                this._minioClient.putObject(bucketName, `${dirName}${fileName}`, fileStream, stats.size, (err, etag) => {
                    if (err) {
                        const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_UPLOADING_FILE, responseCodes.ERRORS.ERROR_UPLOADING_FILE, err);
                        this._logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                        return reject(errorResponse);
                    }
                    if (etag) {
                        const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, etag);
                        this._logger.success(`${this._className}.putObject: ${successResponse.name}`);
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
                this._logger.error(`${this._className}.putStringObject: ${errorResponse.name}`);
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
                    this._logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                if (etag) {
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.STRING_OBJECT_UPLOAD_SUCCESSFULL, responseCodes.INFO.STRING_OBJECT_UPLOAD_SUCCESSFULL, etag);
                    this._logger.success(`${this._className}.putObject: ${successResponse.name}`);
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
                this._logger.error(`${this._className}.getObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.getObject(bucketName, fileName, (error, dataStream) => {
                if (error) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_GETTING_OBJECT, responseCodes.ERRORS.ERROR_GETTING_OBJECT, error);
                    this._logger.error(`${this._className}.getObject: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                let fileData = "";
                dataStream.setEncoding("utf8");
                dataStream.on("data", (chunk) => {
                    fileData += chunk;
                });
                dataStream.on("end", () => {
                    const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_OBJECT_SUCCESSFULL, responseCodes.INFO.GET_OBJECT_SUCCESSFULL, fileData);
                    this._logger.success(`${this._className}.getObject: ${successResponse.name}`);
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
                this._logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            this._minioClient.bucketExists(bucketName, (error, exists) => {
                if (error) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, error);
                    this._logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, exists);
                this._logger.success(`${this._className}.bucketExists: ${successResponse.name}`);
                return resolve(successResponse);
            });
        });
    }
}
exports.MinioHelper = MinioHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluaW9IZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbWluaW8vTWluaW9IZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLHdFQUFxRTtBQUNyRSxzQ0FBbUM7QUFFbkMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLGFBQWEsQ0FBQztBQUM5RSxNQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQztLQUNoRSxvQkFBb0IsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBRTVDLE1BQWEsV0FBVztJQVlwQixZQUFZLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxRQUFnQjtRQVgxRCxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxlQUFVLEdBQUcsYUFBYSxDQUFDO1FBVy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2pDLFFBQVE7WUFDUixNQUFNLEVBQUUsSUFBSTtZQUNaLFNBQVM7WUFDVCxTQUFTO1NBQ1osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFRTSxhQUFhO1FBQ2hC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