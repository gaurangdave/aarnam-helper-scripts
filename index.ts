// import { MinioHelper } from "./minio/MinioHelper";
// import { GoogleStorageHelper } from "./google/storage/GoogleStorageHelper";

const google_storage = require("./google/storage");
const minio = require("./minio");
const logger = require("./logger");
const walker = require("./walker");
const MinioHelper = require("./minio/MinioHelper");

module.exports = {
    google_storage,
    minio,
    logger,
    walker,
    MinioHelper
};
