import * as google_storage from "./lib/google/storage";
import * as minio from "./lib/minio";
import Logger from "./lib/logger";
import * as walker from "./lib/walker";
import * as slackHelper from "./lib/slack";

export { google_storage, minio, Logger, walker, slackHelper };

module.exports = {
    google_storage,
    minio,
    Logger,
    walker,
    slackHelper
};
