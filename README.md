## S3-CACHE-ACTION

This action will cache an user specified directory to a remote AWS S3 bucket

## Required input and output arguments

### inputs

  * s3-bucket-root: eg: 'my-bucket-root' (No need for s3:// prefix)
  * bucket-dir: Second level bucket directory (eg: 'pipeline-cache')
  * cache-key: Third level bucket directory. Suggestion: use hashFiles() github function. eg: hashFiles('./yarn.lock')
  * dir-to-cache: directory's path to cache eg: './node_modules')
  * zip-filename: 'cache.tar' (Optional)
  * dir-to-unzip: './' - Only inform it if you need to unzip in a different path from where the cache was ziped (Optional)

### outputs:

  * operation: retrieval / creation where retrieval is when there is a cache hit and creation when not    

## AWS Credentials / Login

In order to execute with the proper user or role, we recommend you to call the official configure-aws-credentials github action just before s3-cache.

## An example of how to use your action in a workflow

```
  - uses: olxbr/s3-cache@v1.0
    with:
      s3-bucket-root: "pipelinecache"   
      bucket-dir: "github-cache"
      cache-key: build-${{ runner.os }}-cache-yarn-modules-${{ hashFiles('yarn.lock') }}
      dir-to-cache: 'node_modules' 
```