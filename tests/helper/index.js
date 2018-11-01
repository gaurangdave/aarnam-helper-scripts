const Minio = require("minio");
const {
     accessKey,
     secretKey,
     endPoint
} = process.env;
const Q = require("q");


const minioClient = new Minio.Client({
     endPoint,
     useSSL: true,
     accessKey,
     secretKey
});

const createTestBucket = async (bucketName) => {
     try {
          const makeBucketResponse = await minioClient.makeBucket(bucketName);
     } catch (e) {
          console.error('Error creating test bucket', e);
     }
};

const uploadTestData = (bucketName) => {};

const deleteTestData = async (bucketName) => {
     try {
          const removeObjectResponse = await minioClient.removeObject(bucketName, 'test_file.json');
     } catch (e) {
          console.error("Error deleting test bucket", e);
     }
};

const deleteTestBucket = async (bucketName) => {
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
     return new Q.Promise((resolve, reject) => {
          minioClient.listBuckets((error, buckets) => {
               if (error) {
                    console.error("Error getting bucket list", error);
                    return reject();
               }
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