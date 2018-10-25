// Imports the Google Cloud client library.
const Storage = require('@google-cloud/storage').Storage;
const path = require('path');
const logger = require('../aarnamLogger');
const fs = require('fs');
const Q = require('q');


// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md

// TODO Add initialize function to initialize storage object with JSON file page and project id.
const storage = new Storage({
     keyFilename: path.resolve(__dirname, './key/aarnamobjects-jenkins.json'),
     projectId: 'aarnamobjects',
});

/**
 * Function to get list of buckets in Google Cloud Storage.
 */
const getBucketList = () =>
     storage
     .getBuckets()
     .then(results => results[0])
     .catch(err => {
          console.error('ERROR:', err);
     });

/**
 * Function to check whether bucket exists or not.
 * If bucket exists the bucket is returned.
 * @param {*} bucketName
 */
const bucketExists = bucketName =>
     new Q.Promise(async (resolve, reject) => {
          if (!bucketName) {
               logger.error('Bucket name is required param');
               return reject(new Error('Bucket name is required param'));
          }
          const bucketList = (await getBucketList()) || [];
          const requiredBucket = bucketList.find(
               bucket => bucket.name === bucketName
          );
          return resolve(requiredBucket);
     });

/**
 * Helper function to create new bucket on google cloud cdn
 * @param {*} bucketToCreate
 */
// TODO change params to JS object. 
const createBucket = (
          bucketToCreate,
          isBucketPublic = false,
          areFilesPublic = false
     ) =>
     new Q.Promise(async (resolve, reject) => {
          if (!bucketToCreate || typeof bucketToCreate !== 'string') {
               logger.error('Bucket name is not defined');
               return reject(new Error('Bucket name is not defined'));
          }

          const existingBucket = await bucketExists(bucketToCreate);
          if (existingBucket) {
               logger.info(`${bucketToCreate} already exists!`);
               return resolve(existingBucket);
          }
          const newBucket = storage.bucket(bucketToCreate);
          newBucket.create(async (err, bucket) => {
               if (err) {
                    logger.error('Error creating new bucket', err);
                    return reject(err);
               }

               if (isBucketPublic) {
                    const options = {
                         includeFiles: areFilesPublic,
                    };
                    await bucket.makePublic(options);
               }
               logger.success(`Created new bucket ${bucketToCreate}`);
               return resolve(bucket);
          });
     });

/**
 * Helper function to push objects to google cloud storage
 * @param {*} bucketToEdit
 * @param {*} fileToUpload
 * @param {*} isPublic
 */
const putObject = (bucketToEdit, fileToUpload, isPublic = false) =>
     new Q.Promise((resolve, reject) => {
          if (!bucketToEdit || typeof bucketToEdit !== 'string') {
               logger.error('Invalid bucket name');
               return reject(new Error('Invalid bucket name'));
          }
          if (
               !fileToUpload ||
               typeof fileToUpload !== 'string' ||
               !fs.existsSync(fileToUpload)
          ) {
               logger.error(`Invalid or non-existing file ${fileToUpload}`);
               return reject(
                    new Error(`Invalid or non-existing file ${fileToUpload}`)
               );
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
                    logger.error('Error uploading file', error);
                    return reject(error);
               })
               .on('finish', () => {
                    logger.success(
                         `${fileName} successfully uploaded to bucket ${bucketToEdit}`
                    );
                    return resolve();
               });
     });

module.exports = {
     getBucketList,
     bucketExists,
     createBucket,
     putObject,
};