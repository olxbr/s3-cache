const core = require('@actions/core');
const github = require('@actions/github');
const Authentication = require('./Authentication.js');
const CacheOperation = require('./CacheOperation.js');

try {

  const access_id = core.getInput('aws-id');
  const secret_key = core.getInput('aws-key');
  const region = core.getInput('aws-region');

  const bucket_root = core.getInput('s3-bucket-root');
  const filename = core.getInput('zip-filename');
  const bucket_dir = core.getInput('bucket_dir');
  const cache_key = core.getInput('cache_key');
  const dir_to_cache = core.getInput('dir-to-cache');
  const dir_to_unzip = core.getInput('dir-to-unzip');

  const connection = new Authentication(access_id, secret_key, region).login();

  const cacheOperation = new CacheOperation(connection, bucket_root, bucket_dir, cache_key, filename, dir_to_cache, dir_to_unzip);

  cacheOperation.retrieveCache().then((result) => {
    console.log(`RESULT = ${result.operation}`);
    core.debug(`RESULT = ${result.operation}`);
    core.saveState("operation", result.operation);
    core.setOutput(result.operation);
  }, function (err) {
    core.error(err);
    core.saveState("operation", "failed")
    core.setFailed(err);
  })

} catch (error) {
  core.saveState("operation", "failed")
  core.setFailed(err);
  console.log(error);
}