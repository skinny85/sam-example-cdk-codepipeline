# SAM CodePipeline CDK example

This is an example [CDK app](https://aws.amazon.com/cdk)
that creates a CodePipeline that deploys the sample
[SAM](https://aws.amazon.com/serverless/sam) template.

## Deployment instructions

1. Fork this repository.
2. Clone your fork locally.
3. Replace [this line](https://github.com/skinny85/sam-example-cdk-codepipeline/blob/f0a686fce1d2e4472127dc108102a805883c9eff/lib/pipeline-stack.ts#L24)
  with your GitHub username.
4. Replace [this line](https://github.com/skinny85/sam-example-cdk-codepipeline/blob/f0a686fce1d2e4472127dc108102a805883c9eff/lib/pipeline-stack.ts#L26)
  with the name of the AWS SecretsManager Secret that holds your GitHub personal access token.
5. Run `npm install && npm run cdk deploy` to create the CodePipeline (make sure you have your AWS credentials configured).
6. Go to the AWS Console for CodePipeline.
7. Look at your Pipeline flow! It should be all green.
8. The end result of the Pipeline should be creating a `SamExampleStack` CloudFormation Stack.
