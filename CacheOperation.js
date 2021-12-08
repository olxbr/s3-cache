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
        console.log('Cache linha 12')
        this.s3Operation = new S3Operation(connection, bucket_root, bucket_dir, cache_key, filename);
        console.log('Cache linha 14')
        this.zipOperation = new ZipOperation();
        console.log('Cache linha 16')
        this.dir_to_cache = dir_to_cache;
        this.dir_to_unzip = dir_to_unzip;
    }

    retrieveCache() {
        console.log('Cache linha 22')
        return new Promise((resolve, reject) => {
            console.log('Cache linha 24')
            this.s3Operation.pullFile().then((result) => {
                console.log('Cache file downloaded');
                this.zipOperation.unzipFile(`./${this.filename}`, this.dir_to_unzip).then((result) => {
                    console.log('Cache file unzipped');
                    this.lsDir(this.dir_to_cache);
                    resolve({ "operation": "retrieval"});
                }, function (err) {
                    console.log(`Error retrieving cache`);
                    core.error(`Error retrieving cache`);
                    console.log(err); 
                    reject(err);
                })
            }, function (err) {
                console.log('Cache linha 38')
                if (err.code == 'NoSuchKey') {
                    console.log('Cache linha 40')
                    resolve({ "operation": "creation"});;
                } else {
                    console.log('Cache linha 43')
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
                    this.s3Operation.pushFile(fileData).then((result) => {
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