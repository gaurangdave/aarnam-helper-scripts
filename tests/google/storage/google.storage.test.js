const googleHeplerFactory = require("../../../dist").google_storage;
const fs = require('fs');
const path = require('path');
const keyFilePath = `${process.env.googleKeyFile}`;
const keyFileData = fs.readFileSync(keyFilePath);
const projectId = JSON.parse(keyFileData).project_id;
const helper = require("../../helper/google");


describe("test input params", () => {
     test("keyFilePath must be present", () => {
          expect(keyFilePath).toBeDefined();
     });

     test("keyFilePath must exist", () => {
          expect(fs.existsSync(keyFilePath)).toBeTruthy();
     });

     test("projectId must be present", () => {
          expect(projectId).toBeDefined();
     });
});

describe("test object initialization", () => {
     let gsh = null;

     test("object should be null - missing all keys", () => {
          gsh = googleHeplerFactory.initialize({});
          expect(gsh).toBeNull();
     });

     test("object should be null - missing keyFilePath", () => {
          gsh = googleHeplerFactory.initialize({
               projectId
          });
          expect(gsh).toBeNull();
     });

     test("object should be null - missing projectId", () => {
          gsh = googleHeplerFactory.initialize({
               keyFilePath
          });
          expect(gsh).toBeNull();
     });

     test("object should be defined", () => {
          gsh = googleHeplerFactory.initialize({
               keyFilePath,
               projectId
          });
          expect(gsh).toBeDefined();
     });
});

describe("test exported memebers", () => {
     let gsh = {};
     beforeAll(() => {
          gsh = googleHeplerFactory.initialize({
               keyFilePath,
               projectId
          });
     });

     test("should export initialize method", () => {
          expect(gsh).toBeDefined();
     });

     test("should export getBucketList method", () => {
          expect(gsh.getBucketList).toBeDefined();
     });
     test("should export putObject method", () => {
          expect(gsh.putObject).toBeDefined();
     });
     test("should export createBucket method", () => {
          expect(gsh.createBucket).toBeDefined();
     });

     test("should export getObject method", () => {
          expect(gsh.getObject).toBeDefined();
     });

     test("should export removeBucket method", () => {
          expect(gsh.removeBucket).toBeDefined();
     });

     test("should export removeObject method", () => {
          expect(gsh.removeObject).toBeDefined();
     });

     test("should export listObjects method", () => {
          expect(gsh.listObjects).toBeDefined();
     });

     test("should export bucketExists method", () => {
          expect(gsh.bucketExists).toBeDefined();
     });
});

describe("test getBucketList()", () => {
     let gsh = {};
     let bucketListResponse = null;
     beforeAll(async () => {

          gsh = googleHeplerFactory.initialize({
               keyFilePath,
               projectId
          });

          bucketListResponse = await gsh.getBucketList();
     });

     test("getBucketList() response should not be null", () => {
          expect(bucketListResponse).toBeDefined();
     })

     test("getBucketList() response should be an object", () => {
          expect(typeof (bucketListResponse) === "object").toBeTruthy();
     });

     test("getBucketList() response type should be success", () => {
          expect(bucketListResponse._type === "SUCCESS").toBeTruthy();
     });

     test("getBucketList() response name should match", () => {
          expect(bucketListResponse._name === "GET_BUCKET_LIST_SUCCESSFULL").toBeTruthy();
     });

     test("getBucketList() response data should be an array", () => {
          expect(bucketListResponse._data instanceof Array).toBeTruthy();
     });

     test("getBucketList() response data should be non empty array", () => {
          expect(bucketListResponse._data.length).toBeGreaterThan(0);
     });
});

describe("test createBucket()", () => {
     /**
      * Before All
      * 1. Get bucket name with timestamp. const bucketName
      * 2. Use minio helper api to create bucket and save reponse
      *      2.1 Validate response
      * 3. Use minio client api to get bucket list
      *      3.1 Validate the list to see if bucket exists.
      * 
      * 
      * After All
      * 1. Use minio client api to delete the bucket (bucketName)
      *      1.1 If delete bucket fails - console log it!
      */
     const bucketName = `testbucket-${Date.now()}`;
     let bucketCreateResponse = null;
     let bucketList = [];
     beforeAll(async (done) => {

          gsh = googleHeplerFactory.initialize({
               keyFilePath,
               projectId
          });

          bucketCreateResponse = await gsh.createBucket({
               bucketName
          });

          try {
               bucketList = await helper.listBuckets();
               done();
          } catch (e) {
               console.error('Error getting bucket list.', e);
               done();
          }

     }, 15000);

     test("createBucket() response should not be null", () => {
          expect(bucketCreateResponse).toBeDefined();
     })

     test("createBucket() response should be an object", () => {
          expect(typeof (bucketCreateResponse) === "object").toBeTruthy();
     });

     test("createBucket() response type should be success", () => {
          expect(bucketCreateResponse._type === "SUCCESS").toBeTruthy();
     });

     test("createBucket() response name should match", () => {
          expect(bucketCreateResponse._name === "CREATE_BUCKET_SUCCESSFULL").toBeTruthy();
     });

     test("createBucket() new bucket should be in the list", () => {
          const createdBucket = bucketList.find((bc) => {
               return bc === bucketName;
          });

          expect(createdBucket).toBeDefined();
     });

     afterAll(async (done) => {
          try {
               await helper.deleteTestBucket(bucketName);
               done();
          } catch (err) {
               console.error('Error deleting test data');
               done();
          }
     }, 15000);
});

describe("test removeBucket()", () => {
     /**
      * Before All
      * 1. Get bucket name with timestamp. const bucketToDelete
      * 2. Using minio client to create a new bucket. 
      * 3. Use minio helper to remove bucket and save response.
      *      3.1. Validate reponse
      * 4. Use minio client to get bucket list.
      *      4.1 Validate deleted bucket form the list.
      * 
      * 
      * After All
      * 
      */
     const bucketName = `testbucket-${Date.now()}`;
     let bucketDeleteResponse = null;
     let bucketList = [];
     let gsh = null;
     beforeAll(async (done) => {

          gsh = googleHeplerFactory.initialize({
               keyFilePath,
               projectId
          });

          try {
               await helper.createTestBucket(bucketName);
               bucketDeleteResponse = await gsh.removeBucket({
                    bucketName
               });
               bucketList = await helper.listBuckets();
               done()
          } catch (e) {
               console.error('Error creating test bucket', e);
               done();
          }
     }, 15000);

     test("removeBucket() response should not be null", () => {
          expect(bucketDeleteResponse).toBeDefined();
     })

     test("removeBucket() response should be an object", () => {
          expect(typeof (bucketDeleteResponse) === "object").toBeTruthy();
     });

     test("removeBucket() response type should be success", () => {
          expect(bucketDeleteResponse._type === "SUCCESS").toBeTruthy();
     });

     test("removeBucket() response name should match", () => {
          expect(bucketDeleteResponse._name === "REMOVE_BUCKET_SUCCESSFULL").toBeTruthy();
     });

     afterAll(async (done) => {
          // Calling delete in case the test fails. 
          try {
               await helper.deleteTestBucket(bucketName);
               done();
          } catch (deleteErrror) {
               if (deleteErrror.message !== "Not Found") {
                    console.error('Error deleting test data');
               }
               done();
          }

     }, 15000);
});

describe("test putObject()", () => {
     /**
      * Before all
      * 1. Get bucket name with timestamp. const bucketToDelete
      * 2. Using minio client to create a new bucket. 
      * 3. Use minio helper to but test object in new bucket.
      *      3.1 validate response
      * 4. Use minio client to get object list
      *      4.1 validate list
      * 
      * After All
      * 1. Remove test bucket using minio client.
      */
     const bucketName = `testbucket-${Date.now()}`;
     let putObjectResponse = null;
     let gsh = null;
     const filePath = path.resolve(__dirname, '../../data/test_file.json');
     beforeAll(async (done) => {

          gsh = googleHeplerFactory.initialize({
               keyFilePath,
               projectId
          });

          try {
               await helper.createTestBucket(bucketName);
               putObjectResponse = await gsh.putObject({
                    bucketName,
                    filePath
               });

               done();
          } catch (e) {
               console.error('Error creating test bucket', e);
               done();
          }

     }, 15000);

     test("putObject() response should not be null", () => {
          expect(putObjectResponse).toBeDefined();
     })

     test("putObject() response should be an object", () => {
          expect(typeof (putObjectResponse) === "object").toBeTruthy();
     });

     test("putObject() response type should be success", () => {
          expect(putObjectResponse._type === "SUCCESS").toBeTruthy();
     });

     test("putObject() response name should match", () => {
          expect(putObjectResponse._name === "FILE_UPLOAD_SUCCESSFULL").toBeTruthy();
     });

     afterAll(async (done) => {

          try {
               await helper.deleteTestData(bucketName);
               await helper.deleteTestBucket(bucketName);
               done();
          } catch (error) {
               console.error('Error deleting test data');
               done();
          }

     }, 15000);
});

describe("test emptyBucket()", () => {
     /**
      * beforeAll
      * 1. Create testbucket
      * 2. Create testData
      * 3. Call emptyBucket
      * 
      * Tests
      * 1. validate response
      * 
      * afterAll
      * 2. Delete test data. 
      */
     const bucketName = `testbucket-${Date.now()}`;
     let emptyBucketResponse = null;
     const filePath = path.resolve(__dirname, '../../data/test_file.json');
     let gsh = null;
     beforeAll(async (done) => {

          gsh = googleHeplerFactory.initialize({
               keyFilePath,
               projectId
          });

          try {
               await helper.createTestBucket(bucketName);
               await helper.uploadTestData(bucketName, filePath);
               emptyBucketResponse = await gsh.emptyBucket({
                    bucketName
               });
               done();
          } catch (error) {
               console.error('Error creating test data.', error);
               done()
          }

     }, 15000);

     test("emptyBucket() response should not be null", () => {
          expect(emptyBucketResponse).toBeDefined();
     })

     test("emptyBucket() response should be an object", () => {
          expect(typeof (emptyBucketResponse) === "object").toBeTruthy();
     });

     test("emptyBucket() response type should be success", () => {
          expect(emptyBucketResponse._type === "SUCCESS").toBeTruthy();
     });

     test("emptyBucket() response name should match", () => {
          expect(emptyBucketResponse._name === "EMPTY_BUCKET_SUCCESSFULL").toBeTruthy();
     });

     afterAll(async (done) => {

          try {
               await helper.deleteTestData(bucketName);
               await helper.deleteTestBucket(bucketName);
               done();
          } catch (error) {
               console.error('Error deleting test data');
               done();
          }

     }, 15000);
});