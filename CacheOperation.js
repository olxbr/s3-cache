const S3Operation = require('./S3Operation.js');
const ZipOperation = require('./ZipOperation.js');
const fs = require('fs');
const core = require('@actions/core');

class CacheOperation {
    constructor(connection, bucket_root, bucket_dir, cache_key, filename, dir_to_cache, dir_to_unzip) {
        this.connection = connection;
        this.filename = filename;
        this.bucket = `${bucket_root}`;
        this.key = `${bucket_dir}/${cache_key}/${filename}`;
        this.s3Operation = new S3Operation(connection, bucket_root, bucket_dir, cache_key, filename);
        this.zipOperation = new ZipOperation();
        this.dir_to_cache = dir_to_cache;
        this.dir_to_unzip = dir_to_unzip;
    }

    retrieveCache() {
        return new Promise((resolve, reject) => {
            this.s3Operation.pushFile().then((result) => {
                console.log('Cache file downloaded');
                this.zipOperation.unzipFile(`./${this.filename}`, this.dir_to_unzip).then((result) => {
                    console.log('Cache file unzipped');
                    this.lsDir(this.dir_to_cache);
                    resolve({ "operation": "retrieving"});
                }, function (err) {
                    console.log(`Error retrieving cache`);
                    core.error(`Error retrieving cache`);
                    console.log(err); // Error: "It broke"
                    reject(err);
                })
            }, function (err) {
                if (err.code == 'NoSuchKey') {
                    resolve({ "operation": "creation"});;
                } else {
                    core.error(`Error pushing cache file`);
                    console.log(err, err.stack);
                    reject();
                }
            })
        })
    }

    generateCache() {
        return new Promise((resolve, reject) => {
            this.zipOperation.zipFile(this.filename, this.dir_to_cache).then((result) => {
                fs.readFile(this.filename, (err, fileData) => {
                    this.s3Operation.pullFile(fileData).then((result) => {
                        console.log(`file ${this.filename} uploaded`);
                        resolve();
                    }, function (err) {
                        console.log(`Error uploading cache file`);
                        console.log(err, err.stack); 
                        reject(err);
                    });
                });
            }, function (err) {
                console.log(`Error uploading cache file`);
                console.log(err); 
                core.err(err);
                reject(err);
            });
        })
    }

    lsDir(directoryPath) {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            files.forEach(function (file) {
                console.log(file);
            });
        });
    }
}

module.exports = CacheOperation;