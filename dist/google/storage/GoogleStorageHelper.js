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
const storage_1 = require("@google-cloud/storage");
const ServiceResponse_1 = require("../../serviceResponse/ServiceResponse");
const path = require("path");
const logger = require("../../logger");
const fs = require("fs");
const Q = require("q");
const responseCodes = require("../../constants/google");
const isValidString = require("../../validators/string.validator")
    .isValidString;
class GoogleStorageHelper {
    constructor(keyFilename, projectId) {
        this._className = "GoogleStorageHelper";
        this._storage = new storage_1.Storage({
            keyFilename,
            projectId
        });
    }
    createBucket(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName, isBucketPublic = false, areFilesPublic = false } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            let existingBucket = false;
            try {
                existingBucket = (yield this.bucketExists({ bucketName })).data;
            }
            catch (bucketExistsError) {
                return reject(bucketExistsError);
            }
            if (existingBucket) {
                const successResponse = ServiceResponse_1.ServiceResponse.createWarningResponse(responseCodes.INFO.BUCKET_EXISTS, responseCodes.INFO.BUCKET_EXISTS, existingBucket);
                logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }
            const newBucket = this._storage.bucket(bucketName);
            newBucket.create((makeBucketError, bucket) => __awaiter(this, void 0, void 0, function* () {
                if (makeBucketError) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CREATING_BUCKET, responseCodes.ERRORS.ERROR_CREATING_BUCKET, makeBucketError);
                    logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                if (isBucketPublic) {
                    const options = {
                        includeFiles: areFilesPublic
                    };
                    yield bucket.makePublic(options);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.CREATE_BUCKET_SUCCESSFULL, responseCodes.INFO.CREATE_BUCKET_SUCCESSFULL);
                logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }));
        }));
    }
    getBucketList() {
        return new Q.Promise((resolve, reject) => {
            this._storage.getBuckets((getBucketsError, data) => {
                if (getBucketsError) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, getBucketsError);
                    logger.error(`${this._className}.getBucketList: ${errorResponse.name}`, getBucketsError);
                    return reject(getBucketsError);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, data);
                logger.success(`${this._className}.getBucketList: ${successResponse.name}`);
                return resolve(successResponse);
            });
        });
    }
    removeBucket(params) {
        return new Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const bucket = this._storage.bucket(bucketName);
            bucket.delete().then(response => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, response);
                logger.success(`${this._className}.removeBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }, (deleteError) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_REMOVING_BUCKET, responseCodes.ERRORS.ERROR_REMOVING_BUCKET, deleteError);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            });
        });
    }
    emptyBucket(params) {
        return new Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const bucket = this._storage.bucket(bucketName);
            const options = { force: true };
            bucket.deleteFiles(options).then(() => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
                logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }, (deleteFilesError) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_REMOVING_MULTIPLE_OBJECTS, responseCodes.ERRORS.ERROR_REMOVING_MULTIPLE_OBJECTS, deleteFilesError);
                logger.error(`${this._className}.emptyBucket:${errorResponse.name}`, deleteFilesError);
                return reject(errorResponse);
            });
        });
    }
    bucketExists(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const bucket = this._storage.bucket(bucketName);
            bucket.exists((error, exists) => {
                if (error) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, error);
                    logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, exists);
                logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
                return resolve(successResponse);
            });
        }));
    }
    putObject(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName, filePath, isPublic = false } = params;
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
            const options = {
                public: isPublic,
                gzip: "auto",
                contentType: "auto"
            };
            const fileName = path.basename(filePath);
            const bucket = this._storage.bucket(bucketName);
            const file = bucket.file(fileName);
            fs.createReadStream(filePath)
                .pipe(file.createWriteStream(options))
                .on("error", (error) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_UPLOADING_FILE, responseCodes.ERRORS.ERROR_UPLOADING_FILE, error);
                logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            })
                .on("finish", () => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL);
                logger.success(`${this._className}.putObject: ${successResponse.name}`);
                return resolve(successResponse);
            });
        });
    }
    listObjects(params) {
        return new Promise((resolve, reject) => {
            const { bucketName } = params;
        });
    }
    getObject(params) {
        return new Promise((resolve, reject) => {
            const { bucketName, fileName } = params;
        });
    }
    removeObject(params) {
        return new Promise((resolve, reject) => {
            const { bucketName, fileName } = params;
        });
    }
}
exports.GoogleStorageHelper = GoogleStorageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29vZ2xlU3RvcmFnZUhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dvb2dsZS9zdG9yYWdlL0dvb2dsZVN0b3JhZ2VIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLG1EQUF3RDtBQUN4RCwyRUFBd0U7QUFFeEUsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN2QyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXZCLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3hELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQztLQUM3RCxhQUFhLENBQUM7QUFFbkIsTUFBYSxtQkFBbUI7SUFJNUIsWUFBWSxXQUFtQixFQUFFLFNBQWlCO1FBRjFDLGVBQVUsR0FBRyxxQkFBcUIsQ0FBQztRQUd2QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQztZQUN4QixXQUFXO1lBQ1gsU0FBUztTQUNaLENBQUMsQ0FBQztJQUNQLENBQUM7SUFTTSxZQUFZLENBQUMsTUFBVztRQUMzQixPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFPLE9BQWlCLEVBQUUsTUFBZ0IsRUFBRSxFQUFFO1lBQy9ELE1BQU0sRUFDRixVQUFVLEVBQ1YsY0FBYyxHQUFHLEtBQUssRUFDdEIsY0FBYyxHQUFHLEtBQUssRUFDekIsR0FBRyxNQUFNLENBQUM7WUFFWCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUM1QixNQUFNLGFBQWEsR0FBRyxpQ0FBZSxDQUFDLG1CQUFtQixDQUNyRCxhQUFhLENBQUMs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