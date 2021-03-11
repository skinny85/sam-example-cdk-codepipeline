import * as cdk from '@aws-cdk/core';
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import s3 = require('@aws-cdk/aws-s3');

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    // Pipeline creation starts
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket,
    });

    // Declare source code as an artifact
    const sourceOutput = new codepipeline.Artifact();
    // Add source stage to pipeline
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'skinny85',
      repo: 'sam-example-cdk-codepipeline',
      oauthToken: cdk.SecretValue.secretsManager('my-github-private-repos-token'),
      output: sourceOutput,
      branch: 'master',
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // Declare build output as artifacts
    const buildOutput = new codepipeline.Artifact();
    // Declare a new CodeBuild project
    const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
      environment: { buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2 },
      environmentVariables: {
        'PACKAGE_BUCKET': {
          value: artifactBucket.bucketName,
        },
      },
    });
    // Add the build stage to our pipeline
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    // Deploy stage
    pipeline.addStage({
      stageName: 'Dev',
      actions: [
        new codepipeline_actions.CloudFormationCreateReplaceChangeSetAction({
          actionName: 'CreateChangeSet',
          templatePath: buildOutput.atPath("packaged.yaml"),
          stackName: 'SamExampleStack',
          adminPermissions: true,
          changeSetName: 'codepipeline-change-set',
          runOrder: 1
        }),
        new codepipeline_actions.CloudFormationExecuteChangeSetAction({
          actionName: 'Deploy',
          stackName: 'SamExampleStack',
          changeSetName: 'codepipeline-change-set',
          runOrder: 2
        }),
      ],
    });
  }
}
