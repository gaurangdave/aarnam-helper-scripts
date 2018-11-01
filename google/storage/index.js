// Imports the Google Cloud client library.
const Storage = require('@google-cloud/storage').Storage;
const path = require('path');
const logger = require('../..logger');
const fs = require('fs');
const Q = require('q');


let storage = null;
const module = "GOOGLE STORAGE HELPER";

/**
 * Function to instantiate a client by passing key file and project id.
 * @param {*} params 
 */
const initialize = (params) => {
     const {
          keyFilename,
          projectId
     } = params;

     if (!keyFilename) {
          storage = null;
          logger.error(`${module}: Cannot Initialize : undefined or invalid key file.`);
          return false;
     }

     if (!projectId) {
          storage = null;
          logger.error(`${module}: Cannot Initialize : undefined or invalid projectId.`);
          return false;
     }

     storage = new Storage({
          keyFilename,
          projectId,
     });

     return true;
}
/**
 * Function to get list of buckets in Google Cloud Storage.
 */
const getBucketList = () =>
     storage
     .getBuckets()
     .then(results => results[0])
     .catch(err => {
          logger.error(`${module} : Cannot Retrieve Bucket List : `, err);
     });

/**
 * Function to check whether bucket exists or not.
 * If bucket exists the bucket is returned.
 * @param {*} bucketName
 */
const bucketExists = bucketName =>
     new Q.Promise(async (resolve, reject) => {
          if (!bucketName) {
               const errMsg = `${module}: bucketExists : bucket name is required param`;
               logger.error(errMsg);
               return reject(new Error(errMsg));
          }
          const bucketList = (await getBucketList()) || [];
          const requiredBucket = bucketList.find(
               bucket => bucket.name === bucketName
          );
          return resolve(requiredBucket);
     });

/**
 * Helper function to create new bucket on google cloud cdn
 * @param {*} params
 */
// TODO change params to JS object. 
const createBucket = (params) =>
     new Q.Promise(async (resolve, reject) => {
          const {
               bucketName: bucketToCreate,
               isBucketPublic = false,
               areFilesPublic = false
          } = params;

          if (!bucketToCreate || typeof bucketToCreate !== 'string') {
               const errMsg = `${module}: createBucket : bucket name is required param`;
               logger.error(errMsg);
               return reject(new Error(errMsg));
          }

          const existingBucket = await bucketExists(bucketToCreate);

          if (existingBucket) {
               logger.info(`${module}: createBucket : ${bucketToCreate} already exists`);
               return resolve(existingBucket);
          }

          const newBucket = storage.bucket(bucketToCreate);
          newBucket.create(async (err, bucket) => {
               if (err) {
                    const errMsg = `${module}: createBucket : Cannot create new bucket`;
                    logger.error(errMsg, err);
                    return reject(err);
               }

               if (isBucketPublic) {
                    const options = {
                         includeFiles: areFilesPublic,
                    };
                    await bucket.makePublic(options);
               }
               logger.success(`${module}: createBucket : new bucket ${bucketToCreate} created`);
               return resolve(bucket);
          });
     });

/**
 * Helper function to push objects to google cloud storage
 * @param {*} params
 */
const putObject = (params) =>
     new Q.Promise((resolve, reject) => {
          const {
               bucketName: bucketToEdit,
               fileToUpload,
               isPublic = false
          } = params;
          if (!bucketToEdit || typeof bucketToEdit !== 'string') {
               const errMsg = `${module}: putObject : Invalid bucket name`;
               logger.error(errMsg);
               return reject(new Error(errMsg));
          }
          if (
               !fileToUpload ||
               typeof fileToUpload !== 'string' ||
               !fs.existsSync(fileToUpload)
          ) {
               const errMsg = `${module}: putObject : Invalid or non-existing file ${fileToUpload}`;
               logger.error(errMsg);
               return reject(new Error(errMsg));
          }
          const options = {
               public: isPublic,
               gzip: 'auto',
               contentType: 'auto',
          };

          const fileName = path.basename(fileToUpload);
          const bucket = storage.bucket(bucketToEdit);
          const file = bucket.file(fileName);
          fs.createReadStream(fileToUpload)
               .pipe(file.createWriteStream(options))
               .on('error', error => {
                    const errMsg = `${module}: putObject : Error uploading file`;

                    logger.error(errMsg, error);
                    return reject(error);
               })
               .on('finish', () => {
                    logger.success(
                         `${module}: putObject : ${fileName} successfully uploaded to bucket ${bucketToEdit}`
                    );
                    return resolve();
               });
     });


module.exports = {
     initialize,
     getBucketList,
     bucketExists,
     createBucket,
     putObject,
};