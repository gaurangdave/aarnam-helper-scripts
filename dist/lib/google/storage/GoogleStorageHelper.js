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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29vZ2xlU3RvcmFnZUhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9nb29nbGUvc3RvcmFnZS9Hb29nbGVTdG9yYWdlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSxtREFBd0Q7QUFDeEQsMkVBQXdFO0FBRXhFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdkMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV2QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsbUNBQW1DLENBQUM7S0FDN0QsYUFBYSxDQUFDO0FBRW5CLE1BQWEsbUJBQW1CO0lBSTVCLFlBQVksV0FBbUIsRUFBRSxTQUFpQjtRQUYxQyxlQUFVLEdBQUcscUJBQXFCLENBQUM7UUFHdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLENBQUM7WUFDeEIsV0FBVztZQUNYLFNBQVM7U0FDWixDQUFDLENBQUM7SUFDUCxDQUFDO0lBU00sWUFBWSxDQUFDLE1BQVc7UUFDM0IsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBTyxPQUFpQixFQUFFLE1BQWdCLEVBQUUsRUFBRTtZQUMvRCxNQUFNLEVBQ0YsVUFBVSxFQUNWLGNBQWMsR0FBRyxLQUFLLEVBQ3RCLGNBQWMsR0FBRyxLQUFLLEVBQ3pCLEdBQUcsTUFBTSxDQUFDO1lBRVgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxhQUFhLEdBQUcsaUNBQWUsQ0FBQyxtQkFBbUIsQ0FDckQsYUFB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