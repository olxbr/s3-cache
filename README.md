## S3-CACHE-ACTION

This action will cache an user specified directory to a remote AWS S3 bucket

## Required input and output arguments

### inputs

  * aws-id: AWS Authentication Access Id (please inform it from Github secrets) eg: ${{ secrets.myAccessId }} (Optional)
  * aws-key:  AWS Authentication Secret Access Key (please inform it from Github secrets) eg: ${{ secrets.mySecretKey }} (Optional)
  * aws-role: AWS Role to assume (Optional)
  * aws-role-session-name: Assumed role session name (Optional)
  * aws-role-external-id: Assumed role external id (Optional)
  * s3-bucket-root: eg: 'my-bucket-root' (No need for s3:// prefix)
  * bucket-dir: Second level bucket directory (eg: 'pipeline-cache')
  * cache_key: Third level bucket directory. Suggestion: use hashFiles() github function. eg: hashFiles('./yarn.lock')
  * dir-to-cache: directory's path to cache eg: './node_modules')
  * aws-region: 'us-east-1' (Optional)
  * zip-filename: 'cache.tar' (Optional)
  * dir-to-unzip: './' - Only inform it if you need to unzip in a different path from where the cache was ziped (Optional)

### outputs:

  * operation: retrieval / creation where retrieval is when there is a cache hit and creation when not    

## An example of how to use your action in a workflow

```
  - uses: olxbr/s3-cache@v1.0
    with:
      s3-bucket-root: "pipelinecache"   
      bucket-dir: "github-cache"
      cache_key: build-${{ runner.os }}-cache-yarn-modules-${{ hashFiles('yarn.lock') }}
      dir-to-cache: 'node_modules' 
```