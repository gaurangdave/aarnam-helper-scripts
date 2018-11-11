const GoogleStorage = require("@google-cloud/storage").Storage;
const Q = require("q");
const fs = require("fs");
const path = require("path");

const keyFilename = `${process.env.googleKeyFile}`;
const projectId = 'aarnamobjects';
const storage = new GoogleStorage({
     keyFilename,
     projectId
});

const createTestBucket = (bucketName) => {
     return new Q.Promise((resolve, reject) => {
          const newBucket = storage.bucket(bucketName);
          newBucket.create((error, bucket) => {
               if (error) {
                    return reject(error);
               }

               return resolve(bucket);
          });
     });
};

const uploadTestData = (bucketName, filePath) => {
     return new Q.Promise((resolve, reject) => {
          const fileName = path.basename(filePath);
          const bucket = storage.bucket(bucketName);
          const file = bucket.file(fileName);
          fs.createReadStream(filePath)
               .pipe(file.createWriteStream())
               .on("error", (error) => {
                    return reject(error);
               })
               .on("finish", () => {
                    return resolve();
               })

     });
};

const deleteTestBucket = (bucketName) => {
     const bucket = storage.bucket(bucketName);
     return bucket.delete();
};

const deleteTestData = (bucketName) => {
     const bucket = storage.bucket(bucketName);
     return bucket.deleteFiles();
};

const listBuckets = () => {
     return new Q.Promise((resolve, reject) => {
          storage.getBuckets((error, bucketList) => {
               if (error) {
                    return reject(error);
               }

               bucketList = bucketList.map((bucket) => {
                    return bucket.name
               });
               return resolve(bucketList);
          })
     });
};

module.exports = {
     createTestBucket,
     uploadTestData,
     deleteTestBucket,
     deleteTestData,
     listBuckets
};