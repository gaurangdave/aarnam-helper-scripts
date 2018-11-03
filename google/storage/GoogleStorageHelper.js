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
// Imports the Google Cloud client library.
const storage_1 = require("@google-cloud/storage");
const ServiceResponse_1 = require("../../serviceResponse/ServiceResponse");
const path = require("path");
const logger = require("../../logger");
const fs = require("fs");
const Q = require("q");
const responseCodes = require("../constants/google.json");
const isValidString = require("../validators/string.validator").isValidString;
class GoogleStorageHelper {
    constructor(keyFilename, projectId) {
        this._className = "GoogleStorageHelper";
        this._storage = new storage_1.Storage({
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
    createBucket(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName, isBucketPublic = false, areFilesPublic = false } = params;
            if (isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const existingBucket = yield this.bucketExists(bucketName);
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
    /**
     *
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
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
    /**
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
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
            const options = { force: true }; // flag to suppress errors till all files have been processed.
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
    /**
     *
     *
     * @param {string} bucketName
     * @returns {Promise<boolean>}
     * @memberof GoogleStorageHelper
     */
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
    listObjects(params) {
        return new Promise((resolve, reject) => {
            const { bucketName } = params;
        });
    }
    /**
     *
     * @param {*} params
     * @returns {Promise<ServiceResponse>}
     * @memberof GoogleStorageHelper
     */
    putObject(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName, fileToUpload, isPublic = false } = params;
            if (!isValidString(bucketName) || !isValidString(fileToUpload)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            // check if file exists
            if (!fs.existsSync(fileToUpload)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.FILE_DOES_NOT_EXIST, responseCodes.ERRORS.FILE_DOES_NOT_EXIST);
                logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const options = {
                public: isPublic,
                gzip: "auto",
                contentType: "auto"
            };
            const fileName = path.basename(fileToUpload);
            const bucket = this._storage.bucket(bucketName);
            const file = bucket.file(fileName);
            fs.createReadStream(fileToUpload)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29vZ2xlU3RvcmFnZUhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkdvb2dsZVN0b3JhZ2VIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDJDQUEyQztBQUMzQyxtREFBd0Q7QUFDeEQsMkVBQXdFO0FBRXhFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdkMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV2QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMxRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFFOUUsTUFBYSxtQkFBbUI7SUFJNUIsWUFBWSxXQUFtQixFQUFFLFNBQWlCO1FBRjFDLGVBQVUsR0FBRyxxQkFBcUIsQ0FBQztRQUd2QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQztZQUN4QixXQUFXO1lBQ1gsU0FBUztTQUNaLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxZQUFZLENBQUMsTUFBVztRQUMzQixPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFPLE9BQWlCLEVBQUUsTUFBZ0IsRUFBRSxFQUFFO1lBQy9ELE1BQU0sRUFDRixVQUFVLEVBQ1YsY0FBYyxHQUFHLEtBQUssRUFDdEIsY0FBYyxHQUFHLEtBQUssRUFDekIsR0FBRyxNQUFNLENBQUM7WUFFWCxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxhQUFhLEdBQUcsaUNBQWUsQ0FBQyxtQkFBbUIsQ0FDckQsYUFBYSxDQUFDLE1B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