const google_storage = require('./google/storage');
const minio = require("./minio");
const logger = require("./logger");
const walker = require("./walker");

module.exports = {
     google_storage,
     minio,
     logger,
     walker
}