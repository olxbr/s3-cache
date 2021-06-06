## S3-CACHE-ACTION

This action will cache an user specified directory to a remote AWS S3 bucket

## Required input and output arguments

### inputs

  * aws-id:
  * aws-key: 
  * s3-bucket-root: 
  * bucket_dir:
  * cache_key:
  * dir-to-cache:

### outputs:

  * operation: retrieving / creation

## Optional input and output arguments
  
### inputs

  * aws-region: 'us-east-1'
  * zip-filename: 'cache.tar'
  * dir-to-unzip: './'
    
## Secrets the action uses

None

## Environment variables the action uses

  * TEMP_AWS_ACCESS_KEY_ID - used to cache previous runner's aws access key id
  * TEMP_AWS_SECRET_ACCESS_KEY - used to cache previous runner's aws secret access key
  * AWS_ACCESS_KEY_ID 
  * AWS_SECRET_ACCESS_KEY 

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