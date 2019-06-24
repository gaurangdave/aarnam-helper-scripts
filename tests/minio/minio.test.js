const minioHelperFactory = require("../../dist").minio;
const path = require("path");
const helper = require("../helper/minio");
const fs = require("fs");
const keyfilePath = process.env.minioKeyFile;
const secretData = (keyfilePath && fs.readFileSync(keyfilePath)) || "{}";

const {
    accessKey,
    secretKey,
    endPoint
} = JSON.parse(secretData);

describe.skip("test input parameters", () => {
    test("accessKey must be present", () => {
        expect(accessKey).toBeDefined();
    });

    test("secretKey must be present", () => {
        expect(secretKey).toBeDefined();
    });

    test("endPoint must be present", () => {
        expect(endPoint).toBeDefined();
    });
});

describe.skip("test object initialization", () => {
    let mh = null;

    test("object should be null - missing all keys", () => {
        mh = minioHelperFactory.initialize({});
        expect(mh).toBeNull();
    });

    test("object should be null - missing secretKey and endPoint", () => {
        mh = minioHelperFactory.initialize({
            accessKey
        });
        expect(mh).toBeNull();
    });

    test("object should be null - missing endPoint", () => {
        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey
        });
        expect(mh).toBeNull();
    });

    test("object should be defined", () => {
        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey,
            endPoint
        });
        expect(mh).toBeDefined();
    });
});

describe.skip("test exported members", () => {
    let mh = {};
    beforeAll(() => {
        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey,
            endPoint
        });
    });

    test("should export initialize method", () => {
        expect(mh).toBeDefined();
    });

    test("should export isInitialized method", () => {
        expect(mh.isInitialized).toBeDefined();
    });

    test("should export getBucketList method", () => {
        expect(mh.getBucketList).toBeDefined();
    });

    test("should export putObject method", () => {
        expect(mh.putObject).toBeDefined();
    });

    test("should export putStringObject method", () => {
        expect(mh.putStringObject).toBeDefined();
    });

    test("should export createBucket method", () => {
        expect(mh.createBucket).toBeDefined();
    });

    test("should export getObject method", () => {
        expect(mh.getObject).toBeDefined();
    });

    test("should export removeBucket method", () => {
        expect(mh.removeBucket).toBeDefined();
    });

    test("should export removeObject method", () => {
        expect(mh.removeObject).toBeDefined();
    });

    test("should export listObjects method", () => {
        expect(mh.listObjects).toBeDefined();
    });

    test("should export bucketExists method", () => {
        expect(mh.bucketExists).toBeDefined();
    });
});

describe.skip("test getBucketList()", () => {
    let mh = {};
    let bucketListResponse = null;
    beforeAll(async () => {

        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey,
            endPoint
        });

        bucketListResponse = await mh.getBucketList();
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

describe.skip("test createBucket()", () => {
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

        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey,
            endPoint
        });

        bucketCreateResponse = await mh.createBucket({
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
        } catch (error) {
            console.error('Error deleting test data!');
            done();
        }

    }, 15000);
});

describe.skip("test removeBucket()", () => {
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
    beforeAll(async (done) => {

        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey,
            endPoint
        });

        try {
            const makeBucketResponse = await helper.createTestBucket(bucketName);
            bucketDeleteResponse = await mh.removeBucket({
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
        try {
            await helper.deleteTestBucket(bucketName);
            done();
        } catch (error) {
            console.error('Error deleting test data!');
            done();
        }

    }, 15000);
});

describe.skip("test putObject()", () => {
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
    const filePath = path.resolve(__dirname, '../data/test_file.json');
    beforeAll(async (done) => {

        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey,
            endPoint
        });

        try {
            await helper.createTestBucket(bucketName);
            putObjectResponse = await mh.putObject({
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

describe.skip("test putStringObject()", () => {
    /**
     * Before all
     * 1. Get bucket name with timestamp. const bucketToDelete
     * 2. Using minio helper to create a new bucket. 
     * 3. Use minio client to put test string object in new bucket.
     *      3.1 validate response
     * 4. Use minio helper to get object list
     *      4.1 validate list
     * 
     * After All
     * 1. Remove test bucket using minio client.
     */
    const bucketName = `testbucket-${Date.now()}`;
    let putStringObjectResponse = null;
    // const filePath = path.resolve(__dirname, '../data/test_file.json');
    const testData = {
        "message": "hello world"
    };
    const testFile = "test_file.json"
    beforeAll(async (done) => {

        mh = minioHelperFactory.initialize({
            accessKey,
            secretKey,
            endPoint
        });

        try {
            await helper.createTestBucket(bucketName);
            putStringObjectResponse = await mh.putStringObject({
                bucketName,
                fileName: testFile,
                data: JSON.stringify(testData)
            });

            done();
        } catch (e) {
            console.error('Error creating test bucket', e);
            done();
        }

    }, 15000);

    test("putStringObject() response should not be null", () => {
        expect(putStringObjectResponse).toBeDefined();
    })

    test("putObject() response should be an object", () => {
        expect(typeof (putStringObjectResponse) === "object").toBeTruthy();
    });

    test("putObject() response type should be success", () => {
        expect(putStringObjectResponse._type === "SUCCESS").toBeTruthy();
    });

    test("putObject() response name should match", () => {
        expect(putStringObjectResponse._name === "STRING_OBJECT_UPLOAD_SUCCESSFULL").toBeTruthy();
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

describe.skip("test getObject()", () => {
    /**
     * beforeAll:
     * 1. create test bucket using helper code
     * 2. upload test file in test bucket using helper code
     * 3. call getObject()
     * 
     * tests
     * 1. Test response object
     * 2. Test data returned by getObject.
     * 
     * afterAll:
     * 1. Delete test object.
     * 2. Delete test bucket.
     */
    const bucketName = `testbucket-${Date.now()}`;
    let getObjectResponse = null;
    let bucketList = [];
    const filePath = path.resolve(__dirname, '../data/test_file.json');
    const fileName = path.basename(filePath);
    beforeAll(async (done) => {
        try {
            await helper.createTestBucket(bucketName);
            await helper.uploadTestData(bucketName, filePath);

            getObjectResponse = await mh.getObject({
                bucketName,
                fileName
            });
            done();
        } catch (error) {
            console.error('Error creating test data', error);
            done();
        }
    }, 15000);

    test("getObject() response to be defined", () => {
        expect(getObjectResponse).toBeDefined();
    });

    test("putObject() response should be an object", () => {
        expect(typeof (getObjectResponse) === "object").toBeTruthy();
    });

    test("putObject() response type should be success", () => {
        expect(getObjectResponse._type === "SUCCESS").toBeTruthy();
    });

    test("putObject() response name should match", () => {
        expect(getObjectResponse._name === "GET_OBJECT_SUCCESSFULL").toBeTruthy();
    });

    test("getObject() data should match test data", () => {
        const {
            data
        } = getObjectResponse;

        expect(data).toBeDefined();

        const dataObj = JSON.parse(data);

        expect(dataObj.foo).toBeDefined();
        expect(dataObj.foo).toEqual("bar");
    });

    afterAll(async (done) => {
        await helper.deleteTestData(bucketName);
        await helper.deleteTestBucket(bucketName);
        done();
    }, 15000);
});

describe.skip("test listObjects()", () => {
    /**
     *   beforeAll()
     *   1. Create test bucket using minioClient
     *   2. Add testObject using minioClient
     *   3. Call helper method to list objects
     *
     *   1. Verify the reponse. 
     * 
     *   afterAll()
     *   1. Delete objects.
     *   2. Delete test bucket.
     */

    beforeAll(() => {}, 15000);
});

describe.skip("test removeObject()", () => {
    /**
     *   beforeAll()
     *   1. Create test bucket using minioClient
     *   2. Add testObject using minioClient
     *   3. Call helper method to removeObject
     *
     *   1. Verify the reponse. 
     * 
     *   afterAll()
     *   2. Delete test bucket.
     *   
     */
});