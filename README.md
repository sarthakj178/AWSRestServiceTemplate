# AWSRestServiceTemplate
Dummy REST Service built using AWS API Gateway

# Prerequisites
* Need an AWS Account. Sign up on AWS (https://portal.aws.amazon.com/billing/signup#/start).
* Once signed up, go to IAM on AWS Console  (https://console.aws.amazon.com/iam/home?#/home)create a new IAM user for yourself, if you don't have one. Go to the Security Credentials of the new user, create an Access Key and Secret Key for this user and download it, keep it somewhere safe. Detailed instructions here (https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console).
* Install AWS CLI (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html). 
* Install AWS SAM. Detailed instructions here (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).

# Setup
## Set a few environment variables
```
export AWS_REST_SERVICE_NAME=<SOME_FOLDER_NAME> # This will be your REST Service Name as well
export AWS_REST_SERVICE_S3_BUCKET_NAME=<SOME_UNIQUE_S3_BUCKET_NAME> # This has to be unique globally
```
## Setup the codebase
```
git clone https://github.com/sarthakj178/AWSRestServiceTemplate.git $AWS_REST_SERVICE_NAME
cd $AWS_REST_SERVICE_NAME
npm install
```
## Test the service locally
```
sam local start-api # This will start your service locally on port 3000
curl -X GET "http://localhost:3000/ping" # On a different tab. Should return {"success":true,"message":"Hello world"}
```

## Release to production
```
aws s3 mb s3://$AWS_REST_SERVICE_S3_BUCKET_NAME
sam package --template-file template.yaml   --s3-bucket $AWS_REST_SERVICE_S3_BUCKET_NAME --output-template-file packaged.yaml
sam deploy --template-file ./packaged.yaml --stack-name $AWS_REST_SERVICE_NAME --capabilities CAPABILITY_IAM
```
