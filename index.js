const AWS = require('aws-sdk');
const core = require('@actions/core');
const github = require('@actions/github');
const CacheOperation = require('./CacheOperation.js');
const process = require('process');

try {
  const bucket_root = core.getInput('s3-bucket-root');
  const filename = core.getInput('zip-filename');
  const bucket_dir = core.getInput('bucket-dir');
  const cache_key = core.getInput('cache-key');
  const dir_to_cache = core.getInput('dir-to-cache');
  const dir_to_unzip = core.getInput('dir-to-unzip');

  const cacheOperation = new CacheOperation(AWS, bucket_root, bucket_dir, cache_key, filename, dir_to_cache, dir_to_unzip);
  cacheOperation.retrieveCache().then((result) => {
    console.log(`RESULT = ${result.operation}`);
    core.debug(`RESULT = ${result.operation}`);
    core.saveState("operation", result.operation);
    console.log('Save State operation OK');
    core.setOutput('operation', result.operation);
  }, function (err) {
    core.error(err);
    core.saveState("operation", "failed")
    core.setFailed(err);
    process.exit(1);
  })
} catch (error) {
  core.saveState("operation", "failed")
  core.setFailed(error);
  console.log(error);
  process.exit(1);
}