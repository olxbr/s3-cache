## S3-CACHE-ACTION

This action will cache an user specified directory to a remote AWS S3 bucket

## Required input and output arguments

### inputs

  * aws-access-key-id: AWS Authentication Access Id (please inform it from Github secrets) eg: ${{ secrets.myAccessId }}
  * aws-access-key:  AWS Authentication Secret Access Key (please inform it from Github secrets) eg: ${{ secrets.mySecretKey }}
  * s3-bucket-root: eg: 'my-bucket-root' (No need for s3:// prefix)
  * s3-bucket-dir: Second level bucket directory (eg: 'pipeline-cache')
  * key: Third level bucket directory. Suggestion: use hashFiles() github function. eg: hashFiles('./yarn.lock')
  * path: directory's path to cache eg: './node_modules')

### outputs:

  * operation: retrieval / creation where retrieval is when there is a cache hit and creation when not

## Optional input and output arguments
  
### inputs

  * aws-region: 'us-east-1'
  * zip-filename: 'cache.tar'
  * dir-to-unzip: './' - Only inform it if you need to unzip in a different path from where the cache was ziped
    
## Secrets the action uses

None

## An example of how to use your action in a workflow

```
  - uses: olxbr/s3-cache@v1.0
    with:
      aws-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws-key: ${{ secrets.AWS_ACCESS_SECRET_KEY }}
      s3-bucket-root: "pipelinecache"   
      bucket_dir: "github-cache"
      cache_key: build-${{ runner.os }}-cache-yarn-modules-${{ hashFiles('yarn.lock') }}
      zip-filename: 'custom_cache.tar'
      dir-to-cache: 'node_modules' 
```