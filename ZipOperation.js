const fs = require('fs');
const core = require('@actions/core');
const tar = require('tar');

class ZipOperation {
    constructor() {

    }

    unzipFile(path, dir_to_unzip) {
        return new Promise((resolve, reject) => {
            tar.x({
                file: path,
                C: dir_to_unzip
            }).then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
        })
    }

    zipFile(filename, source) {
        console.log(`C: ${source}`);
        core.debug(`C: ${source}`);
        return new Promise((resolve, reject) => {
            tar.c({
                gzip: true,
                file: filename
            },[source]).then((result) => {
                console.log(`tar file created: ${filename}`);
                resolve(result);
            }, (err) => {
                reject(err);
            })
        })
    }
}

module.exports = ZipOperation;