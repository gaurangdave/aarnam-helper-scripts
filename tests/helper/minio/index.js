const Minio = require("minio");
const Q = require("q");
const fs = require("fs");
const path = require("path");


const keyfilePath = process.env.minioKeyFile;
const secretData = (keyfilePath && fs.readFileSync(keyfilePath)) || "{}";


const {
     accessKey,
     secretKey,
     endPoint
} = JSON.parse(secretData);

let minioClient = null;

const initMinioClient = () => {
     if(!minioClient) {
          minioClient = new Minio.Client({
               endPoint,
               useSSL: true,
               accessKey,
               secretKey
          });
     }
     return minioClient
}


const createTestBucket = async (bucketName) => {
     initMinioClient();
     try {
          const makeBucketResponse = await minioClient.makeBucket(bucketName);
     } catch (e) {
          console.error('Error creating test bucket', e);
     }
};

const uploadTestData = (bucketName, filePath) => {
     initMinioClient();
     return new Q.Promise((resolve, reject) => {
          var fileStream = fs.createReadStream(filePath)
          const fileName = path.basename(filePath);

          fs.stat(filePath, function (err, stats) {
               if (err) {
                    return reject(err)
               }
               minioClient.putObject(bucketName, fileName, fileStream, stats.size, function (err, etag) {
                    if (err) {
                         return reject(err);
                    }

                    return resolve(etag);
               })
          })
     });
};

const deleteTestData = async (bucketName) => {
     initMinioClient();
     try {
          const removeObjectResponse = await minioClient.removeObject(bucketName, 'test_file.json');
     } catch (e) {
          console.error("Error deleting test bucket", e);
     }
};

const deleteTestBucket = async (bucketName) => {
     initMinioClient();
     try {
          const deleteResponse = await minioClient.removeBucket(bucketName);
     } catch (e) {
          if (e.code !== "NoSuchBucket") {
               // only log error if its something else. 
               console.error("Error deleting test bucket", e);
          }
     }
};

const listBuckets = () => {
     initMinioClient();
     return new Q.Promise((resolve, reject) => {
          minioClient.listBuckets((error, buckets) => {
               if (error) {
                    console.error("Error getting bucket list", error);
                    return reject();
               }
               buckets = buckets.map((bckt) => {
                    return bckt.name
               });
               return resolve(buckets);
          });
     });
}


module.exports = {
     createTestBucket,
     uploadTestData,
     deleteTestBucket,
     deleteTestData,
     listBuckets
};