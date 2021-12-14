const core = require('@actions/core');
const Authentication = require('./Authentication.js');
const CacheOperation = require('./CacheOperation.js');
const fs = require('fs');

const access_id = core.getInput('aws-id');
const secret_key = core.getInput('aws-key');
const region = core.getInput('aws-region');
const role = core.getInput('aws-role');
const roleSessionName = core.getInput('aws-role-session-name');
const externalId = core.getInput('aws-role-external-id');

const bucket_root = core.getInput('s3-bucket-root');
const filename = core.getInput('zip-filename');
const bucket_dir = core.getInput('bucket_dir');
const cache_key = core.getInput('cache_key');
const dir_to_cache = core.getInput('dir-to-cache');

const auth = new Authentication(access_id, secret_key, region)

function cacheCleanUp(connection) {
    try {
        var operation = core.getState("operation");
        console.log(`OPERATION ${operation}`);
        if (operation == 'creation') {
            const cacheOperation = new CacheOperation(connection, bucket_root, bucket_dir, cache_key, filename, dir_to_cache);
            cacheOperation.generateCache().then((result) => {
                core.info('Cache generation succeded');
                auth.logout();
            }, function (err) {
                core.error(err);
                auth.logout();
                core.setFailed(err);
            })
        } else {
            core.info('Cache was found. No need for a new cache creation.');
            auth.logout();
        }
    } catch (err) {
        core.error(err);
        auth.logout();
        core.setFailed(err);
    }
}

try {
    if (access_id != '') {
        auth.login(role, roleSessionName, externalId).then((connection) => {
            cacheCleanUp(connection)
        })
    } else {
        connection = Authentication.emptyConnector()
    }
} catch (error) {
    core.error(error);
    auth.logout();
    core.setFailed(error);
}