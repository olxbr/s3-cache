const core = require('@actions/core');
const CacheOperation = require('./CacheOperation.js');
const fs = require('fs');
const AWS = require('aws-sdk');

const bucket_root = core.getInput('s3-bucket-root');
const filename = core.getInput('zip-filename');
const bucket_dir = core.getInput('bucket-dir');
const cache_key = core.getInput('cache-key');
const dir_to_cache = core.getInput('dir-to-cache');

try {
    var operation = core.getState("operation");
    console.log(`OPERATION ${operation}`);
    if (operation == 'creation') {
        const cacheOperation = new CacheOperation(AWS, bucket_root, bucket_dir, cache_key, filename, dir_to_cache);
        cacheOperation.generateCache().then((result) => {
            core.info('Cache generation succeded');
        }, function (err) {
            core.error(err);
            core.setFailed(err);
        })
    } else {
        core.info('Cache was found. No need for a new cache creation.');
    }
} catch (err) {
    core.error(err);
    core.setFailed(err);
}