const fs = require('fs');
const core = require('@actions/core');
const mime = require('mime');

class S3Operation {
  constructor(aws, bucket_root, bucket_dir, cache_key, filename) {
    this.filename = filename;
    this.bucket = `${bucket_root}`;
    this.key = `${bucket_dir}/${cache_key}/${filename}`;
    this.AWS_SDK = aws;
    console.log('S3 linha 11');
    this.s3 = new this.AWS_SDK.S3();
    console.log('S3 linha 13');
  }

  pullFile() {
    console.log('S3 linha 17')
    var params = {
      Bucket: this.bucket,
      Key: this.key
    };

    return new Promise((resolve, reject) => {
      console.log('S3 linha 24')
      var s3Stream =  this.s3.getObject(params).createReadStream();
      var fileStream = fs.createWriteStream(`${this.filename}`);
      s3Stream.on('error', (err) => {
        console.log('S3 linha 28')
        console.log(err);
        if (err) {
          console.log('S3 linha 31')
          core.warning(`CODE = ${err.code}`);
          if (err.code == 'NoSuchKey') {
            core.info('No remote cache found');
            reject({ 'code': 'NoSuchKey' });
          } else {
            console.log('S3 linha 37')
            core.error(err);
            reject();
          }
        } else {
          console.log('S3 linha 42')
          reject();
        }
      })
      fileStream.on('error', (err) => {
        console.log('S3 linha 47')
        console.log(err);
        if (err) {
          core.warning(`CODE = ${err.code}`);
          console.log(`CODE = ${err.code}`);
          if (err.code == 'NoSuchKey') {
            core.info('No remote cache found');
            console.log('No remote cache found');
            resolve();
          } else {
            console.log('S3 linha 57')
            core.error(err);
            console.log(err, err.stack);
            core.saveState("status", "failed");
            core.setFailed(error.message);
            reject();
          }
        } else {
          console.log('S3linha 65')
          reject();
        }
      })
      console.log('S3 linha 69')
      fileStream.on('close',resolve);
      s3Stream.pipe(fileStream);
      console.log('S3 linha 72')
    })
  }

  pushFile(fileData) {
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        Bucket: `${this.bucket}`,
        Key: `${this.key}`,
        Body: fileData,
        ContentType: mime.getType(`${this.key}`)
      }, (err, data) => {
        if (err) {
          core.error(err);
          console.log(err, err.stack);
        }
        err ? reject(err) : resolve(data);
      });
    });
  }

};

module.exports = S3Operation;