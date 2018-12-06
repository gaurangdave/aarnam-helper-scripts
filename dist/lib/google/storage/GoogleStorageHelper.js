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
const logger_1 = require("../../logger");
const path = require("path");
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
        this._logger = new logger_1.Logger();
    }
    createBucket(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName, isBucketPublic = false, areFilesPublic = false } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                this._logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
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
                this._logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }
            const newBucket = this._storage.bucket(bucketName);
            newBucket.create((makeBucketError, bucket) => __awaiter(this, void 0, void 0, function* () {
                if (makeBucketError) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CREATING_BUCKET, responseCodes.ERRORS.ERROR_CREATING_BUCKET, makeBucketError);
                    this._logger.error(`${this._className}.createBucket: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                if (isBucketPublic) {
                    const options = {
                        includeFiles: areFilesPublic
                    };
                    yield bucket.makePublic(options);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.CREATE_BUCKET_SUCCESSFULL, responseCodes.INFO.CREATE_BUCKET_SUCCESSFULL);
                this._logger.success(`${this._className}.createBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }));
        }));
    }
    getBucketList() {
        return new Q.Promise((resolve, reject) => {
            this._storage.getBuckets((getBucketsError, data) => {
                if (getBucketsError) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, responseCodes.ERRORS.ERROR_GETTING_BUCKET_LIST, getBucketsError);
                    this._logger.error(`${this._className}.getBucketList: ${errorResponse.name}`, getBucketsError);
                    return reject(getBucketsError);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, responseCodes.INFO.GET_BUCKET_LIST_SUCCESSFULL, data);
                this._logger.success(`${this._className}.getBucketList: ${successResponse.name}`);
                return resolve(successResponse);
            });
        });
    }
    removeBucket(params) {
        return new Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                this._logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const bucket = this._storage.bucket(bucketName);
            bucket.delete().then(response => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, responseCodes.INFO.REMOVE_BUCKET_SUCCESSFULL, response);
                this._logger.success(`${this._className}.removeBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }, (deleteError) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_REMOVING_BUCKET, responseCodes.ERRORS.ERROR_REMOVING_BUCKET, deleteError);
                this._logger.error(`${this._className}.removeBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            });
        });
    }
    emptyBucket(params) {
        return new Promise((resolve, reject) => {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                this._logger.error(`${this._className}.emptyBucket: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const bucket = this._storage.bucket(bucketName);
            const options = { force: true };
            bucket.deleteFiles(options).then(() => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL, responseCodes.INFO.EMPTY_BUCKET_SUCCESSFULL);
                this._logger.success(`${this._className}.emptyBucket: ${successResponse.name}`);
                return resolve(successResponse);
            }, (deleteFilesError) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_REMOVING_MULTIPLE_OBJECTS, responseCodes.ERRORS.ERROR_REMOVING_MULTIPLE_OBJECTS, deleteFilesError);
                this._logger.error(`${this._className}.emptyBucket:${errorResponse.name}`, deleteFilesError);
                return reject(errorResponse);
            });
        });
    }
    bucketExists(params) {
        return new Q.Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const { bucketName } = params;
            if (!isValidString(bucketName)) {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.REQUIRED_PARAM_MISSING, responseCodes.ERRORS.REQUIRED_PARAM_MISSING);
                this._logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                return reject(errorResponse);
            }
            const bucket = this._storage.bucket(bucketName);
            bucket.exists((error, exists) => {
                if (error) {
                    const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, responseCodes.ERRORS.ERROR_CHECKING_BUCKET_STATUS, error);
                    this._logger.error(`${this._className}.bucketExists: ${errorResponse.name}`);
                    return reject(errorResponse);
                }
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, responseCodes.INFO.CHECKING_BUCKET_STATUS_SUCCESSFULL, exists);
                this._logger.success(`${this._className}.bucketExists: ${successResponse.name}`);
                return resolve(successResponse);
            });
        }));
    }
    putObject(params) {
        return new Q.Promise((resolve, reject) => {
            const { bucketName, filePath, isPublic = false } = params;
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
            if (dirName === "./") {
                dirName = "";
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
                .on("error", (error) => {
                const errorResponse = ServiceResponse_1.ServiceResponse.createErrorResponse(responseCodes.ERRORS.ERROR_UPLOADING_FILE, responseCodes.ERRORS.ERROR_UPLOADING_FILE, error);
                this._logger.error(`${this._className}.putObject: ${errorResponse.name}`);
                return reject(errorResponse);
            })
                .on("finish", () => {
                const successResponse = ServiceResponse_1.ServiceResponse.createSuccessResponse(responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL, responseCodes.INFO.FILE_UPLOAD_SUCCESSFULL);
                this._logger.success(`${this._className}.putObject: ${successResponse.name}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29vZ2xlU3RvcmFnZUhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9nb29nbGUvc3RvcmFnZS9Hb29nbGVTdG9yYWdlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSxtREFBd0Q7QUFDeEQsMkVBQXdFO0FBQ3hFLHlDQUFvQztBQUVwQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV2QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsbUNBQW1DLENBQUM7S0FDN0QsYUFBYSxDQUFDO0FBRW5CLE1BQWEsbUJBQW1CO0lBSTVCLFlBQVksV0FBbUIsRUFBRSxTQUFpQjtRQUYxQyxlQUFVLEdBQUcscUJBQXFCLENBQUM7UUFHdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLENBQUM7WUFDeEIsV0FBVztZQUNYLFNBQVM7U0FDWixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQVNNLFlBQVksQ0FBQyxNQUEwQjtRQUMxQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFPLE9BQWlCLEVBQUUsTUFBZ0IsRUFBRSxFQUFFO1lBQy9ELE1BQU0sRUFDRixVQUFVLEVBQ1YsY0FBYyxHQUFHLEtBQUssRUFDdEIsY0FBYyxHQUFHLEtBQUssRUFDekIsR0FBRyxNQUFNLENBQUM7WUFFWCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUM1QixNQUFNLGFBQWEsR0FBRyxpQ0FBZSxDQUFDLG1CQUFtQixDQUNyRCxhQUFhLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUMzQyxhQUFhLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUM5QyxDQUFDO2dCQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUNkLEdBQUcsSUFBSSxDQUFDLFVBQVUsa0JBQWtCLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FDM0QsQ0FBQztnQkFDRixPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNoQztZQUVELElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztZQUMzQixJQUFJO2dCQUNBLGNBQWMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDbkU7WUFBQyxPQUFPLGlCQUFpQixFQUFFO2dCQUN4QixPQUFPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQ3BDO1lBRUQsSUFBSSxjQUFjLEVBQUU7Z0JBQ2hCLE1BQU0sZUFBZSxHQUFHLGlDQUFlLENBQUMscUJBQXFCLENBQ3pELGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUNoQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFDaEMsY0FBYyxDQUNqQixDQUFDO2dCQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUNoQixHQUFHLElBQUksQ0FBQyxVQUFVLGtCQUFrQixlQUFlLENBQUMsSUFBSSxFQUFFLENBQzdELENBQUM7Z0JBQ0YsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDbkM7WUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRCxTQUFTLENBQUMsTUFBTSxDQUFDLENBQU8sZUFBc0IsRUFBRSxNQUFjLEVBQUUsRUFBRTtnQkFDOUQsSUFBSSxlQUFlLEVBQUU7b0JBQ2pCLE1BQU0sYUFBYSxHQUFHLGlDQUFlLENBQUMsbUJBQW1CLENBQ3JELGFBQWEsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQzFDLGFBQWEsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQzFDLGVBQWUsQ0FDbEIsQ0FBQztvQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDZCxHQUFHLElBQUksQ0FBQyxVQUFVLGtCQUFrQixhQUFhLENBQUMsSUFBSSxFQUFFLENBQzNELENBQUM7b0JBQ0YsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ2hDO2dCQUVELElBQUksY0FBYyxFQUFFO29CQUNoQixNQUFNLE9BQU8sR0FBRzt3QkFDWixZQUFZLEVBQUUsY0FBYztxQkFDL0IsQ0FBQztvQkFDRixNQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDO2dCQUVELE1BQU0sZUFBZSxHQUFHLGlDQUFlLENBQUMscUJBQXFCLENBQ3pELGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQzVDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQy9DLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQ2hCLEdBQUcsSUFBSSxDQUFDLFVBQVUsa0JBQWtCLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FDN0QsQ0FBQztnQkFDRixPQUFPLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUM7SUFPTSxhQUFhO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBaUIsRUFBRSxNQUFnQixFQUFFLEVBQUU7WUFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQ3BCLENBQUMsZUFBc0IsRUFBRSxJQUFjLEVBQUUsRUFBRTtnQkFDdkMsSUFBSSxlQUFlLEVBQUU7b0JBQ2pCLE1BQU0sYUFBYSxHQUFHLGlDQUFlLENBQUMsbUJBQW1CLENBQ3JELGFBQWEsQ0FBQyxNQUFNLENBQUMseUJBQXlCLEVBQzlDLGFBQWEsQ0FBQyxNQUFNLENBQUMseUJBQXlCLEVBQzlDLGVBQWUsQ0FDbEIsQ0FBQztvQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDZCxHQUFHLElBQUksQ0FBQyxVQUFVLG1CQUNkLGFBQWEsQ0FBQyxJQUNsQixFQUFFLEVBQ0YsZUFBZSxDQUNsQixDQUFDO29CQUNGLE9BQU8sTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2lCQUNsQztnQkFFRCxNQUFNLGVBQWUsR0FBRyxpQ0FBZSxDQUFDLHFCQUFxQixDQUN6RCxhQUFhLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUM5QyxhQUFhLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUM5QyxJQUFJLENBQ1AsQ0FBQztnQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FDaEIsR0FBRyxJQUFJLENBQUMsVUFBVSxtQkFDZCxlQUFlLENBQUMsSUFDcEIsRUFBRSxDQUNMLENBQUM7Z0JBQ0YsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFRTSxZQUFZLENBQUMsTUFBd0I7UUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQWlCLEVBQUUsTUFBZ0IsRUFBRSxFQUFFO1lBQ3ZELE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFFOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxhQUFhLEdBQUcsaUNBQWUsQ0FBQyxtQkFBbUIsQ0FDckQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFDM0MsYUFBYSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FDOUMsQ0FBQztnQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDZCxHQUFHLElBQUksQ0FBQyxVQUFVLGtCQUFrQixhQUFhLENBQUMsSUFBSSxFQUFFLENBQzNELENBQUM7Z0JBQ0YsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDaEM7WUFFRCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUNoQixRQUFRLENBQUMsRUFBRTtnQkFDUCxNQUFNLGVBQWUsR0FBRyxpQ0FBZSxDQUFDLHFCQUFxQixDQUN6RCxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUM1QyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUM1QyxRQUFRLENBQ1gsQ0FBQztnQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FDaEIsR0FBRyxJQUFJLENBQUMsVUFBVSxrQkFDZCxlQUFlLENBQUMsSUFDcEIsRUFBRSxDQUNMLENBQUM7Z0JBQ0YsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxFQUNELENBQUMsV0FBa0IsRUFBRSxFQUFFO2dCQUNuQixNQUFNLGFBQWEsR0FBRyxpQ0FBZSxDQUFDLG1CQUFtQixDQUNyRCxhQUFhLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUMxQyxhQUFhLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUMxQyxXQUFXLENBQ2QsQ0FBQztnQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDZCxHQUFHLElBQUksQ0FBQyxVQUFVLGtCQUFrQixhQUFhLENBQUMsSUFBSSxFQUFFLENBQzNELENBQUM7Z0JBQ0YsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxXQUFXLENBQUMsTUFBd0I7UUFDdkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQWlCLEVBQUUsTUFBZ0IsRUFBRSxFQUFFO1lBQ3ZELE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxhQUFhLEdBQUcsaUNBQWUsQ0FBQyxtQkFBbUIsQ0FDckQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFDM0MsYUFBYSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FDOUMsQ0FBQztnQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDZCxHQUFHLElBQUksQ0FBQyxVQUFVLGlCQUFpQixhQUFhLENBQUMsSUFBSSxFQUFFLENBQzFELENBQUM7Z0JBQ0YsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDaEM7WUFFRCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCxNQUFNLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUNoQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDNUIsR0FBRyxFQUFFO2dCQUNELE1BQU0sZUFBZSxHQUFHLGlDQUFlLENBQUMscUJBQXFCLENBQ3pELGFBQWEsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQzNDLGFBQWEsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQzlDLENBQUM7Z0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQ2hCLEdBQUcsSUFBSSxDQUFDLFVBQVUsaUJBQ2QsZUFBZSxDQUFDLElBQ3BCLEVBQUUsQ0FDTCxDQUFDO2dCQUVGLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsRUFDRCxDQUFDLGdCQUF1QixFQUFFLEVBQUU7Z0JBQ3hCLE1BQU0sYUFBYSxHQUFHLGlDQUFlLENBQUMsbUJBQW1CLENBQ3JELGFBQWEsQ0FBQyxNQUFNLENBQUMsK0JBQStCLEVBQ3BELGFBQWEsQ0FBQyxNQUFNLENBQUMsK0JBQStCLEVBQ3BELGdCQUFnQixDQUNuQixDQUFDO2dCQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUNkLEdBQUcsSUFBSSxDQUFDLFVBQVUsZ0JBQWdCLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFDdEQsZ0JBQWdCLENBQ25CLENBQUM7Z0JBRUYsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFTTSxZQUFZLENBQUMsTUFBd0I7UUFDeEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBTyxPQUFpQixFQUFFLE1BQWdCLEVBQUUsRUFBRTtZQUMvRCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzVCLE1BQU0sYUFBYSxHQUFHLGlDQUFlLENBQUMsbUJBQW1CLENBQ3JELGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQzNDLGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQzlDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQ2QsR0FBRyxJQUFJLENBQUMsVUFBVSxrQkFBa0IsYUFBYSxDQUFDLElBQUksRUFBRSxDQUMzRCxDQUFDO2dCQUNGLE9BQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ2hDO1lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFaEQsTUFBTSxDQUFDLE1BQU0sQ0FDVCxDQUFDLEtBQW1CLEVBQUUsTUFBMkIsRUFBRSxFQUFFO2dCQUNqRCxJQUFJLEtBQUssRUFBRTtvQkFDUCxNQUFNLGFBQWEsR0FBRyxpQ0FBZSxDQUFDLG1CQUFtQixDQUNyRCxhQUFhLENBQUMsTUFBTSxDQUFDLDRCQUE0QixFQUNqRCxhQUFhLENBQUMsTUFBTSxDQUFDLDRCQUE0QixFQUNqRCxLQUFLLENBQ1IsQ0FBQztvQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDZCxHQUFHLElBQUksQ0FBQyxVQUFVLGtCQUNkLGFBQWEsQ0FBQyxJQUNsQixFQUFFLENBQ0wsQ0FBQztvQkFDRixPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDaEM7Z0JBRUQsTUFBTSxlQUFlLEdBQUcsaUNBQWUsQ0FBQyxxQkFBcUIsQ0FDekQsYUFBYSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFDckQsYUFBYSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFDckQsTUFBTSxDQUNULENBQUM7Z0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQ2hCLEdBQUcsSUFBSSxDQUFDLFVBQVUsa0JBQ2QsZUFBZSxDQUFDLElBQ3BCLEVBQUUsQ0FDTCxDQUFDO2dCQUVGLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FDSixDQUFDO1FBQ04sQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUM7SUFRTSxTQUFTLENBQUMsTUFBdUI7UUFDcEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFpQixFQUFFLE1BQWdCLEVBQUUsRUFBRTtZQUN6RCxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEdBQUcsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQzFELElBQUksRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBRWhDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sYUFBYSxHQUFHLGlDQUFlLENBQUMsbUJBQW1CLENBQ3JELGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQzNDLGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQzlDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQ2QsR0FBRyxJQUFJLENBQUMsVUFBVSxlQUFlLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FDeEQsQ0FBQztnQkFDRixPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNoQztZQUdELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMxQixNQUFNLGFBQWEsR0FBRyxpQ0FBZSxDQUFDLG1CQUFtQixDQUNyRCxhQUFhLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUN4QyxhQUFhLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUMzQyxDQUFDO2dCQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUNkLEdBQUcsSUFBSSxDQUFDLFVBQVUsZUFBZSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQ3hELENBQUM7Z0JBQ0YsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDaEM7WUFHRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUM7YUFDM0I7WUFHRCxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQ2xCLE9BQU8sR0FBRyxFQUFFLENBQUM7YUFDaEI7WUFFRCxNQUFNLE9BQU8sR0FBRztnQkFDWixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osV0FBVyxFQUFFLE1BQU07YUFDdEIsQ0FBQztZQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7aUJBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3JDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFZLEVBQUUsRUFBRTtnQkFDMUIsTUFBTSxhQUFhLEdBQUcsaUNBQWUsQ0FBQyxtQkFBbUIsQ0FDckQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFDekMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFDekMsS0FBSyxDQUNSLENBQUM7Z0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQ2QsR0FBRyxJQUFJLENBQUMsVUFBVSxlQUFlLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FDeEQsQ0FBQztnQkFDRixPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQUM7aUJBQ0QsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0JBQ2YsTUFBTSxlQUFlLEdBQUcsaUNBQWUsQ0FBQyxxQkFBcUIsQ0FDekQsYUFBYSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFDMUMsYUFBYSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FDN0MsQ0FBQztnQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FDaEIsR0FBRyxJQUFJLENBQUMsVUFBVSxlQUFlLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FDMUQsQ0FBQztnQkFDRixPQUFPLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLFdBQVcsQ0FBQyxNQUF3QjtRQUN2QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBaUIsRUFBRSxNQUFnQixFQUFFLEVBQUU7WUFDdkQsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxTQUFTLENBQUMsTUFBc0I7UUFDbkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQWlCLEVBQUUsTUFBZ0IsRUFBRSxFQUFFO1lBQ3ZELE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLFlBQVksQ0FBQyxNQUFzQjtRQUN0QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBaUIsRUFBRSxNQUFnQixFQUFFLEVBQUU7WUFDdkQsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFsWUQsa0RBa1lDIn0=