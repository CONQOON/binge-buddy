import { spawnSync } from 'child_process';
import { S3DeployExecutorSchema } from './schema';
import { readFileSync } from 'fs';
import { join } from "path";

export default async function runExecutor(options: S3DeployExecutorSchema) {
  const cwd = process.cwd()
  const awsConfigPath = join(cwd, 'config', 'aws.json');
  const feBuildDir = join(cwd, 'dist','apps', 'binge-buddy');
  const awsConfig = JSON.parse(readFileSync(awsConfigPath, 'utf-8'));

  const {app_deployment_bucket_id: bucket, app_distribution_id: distributionId} = awsConfig;

  // Use AWS CLI to sync the build to the S3 bucket
  const deployProcess = spawnSync('aws', ['s3', 'sync', feBuildDir, `s3://${bucket}`], {
    cwd: './',
    stdio: 'inherit',
  });

  if (deployProcess.error) {
    console.error(`Deployment to S3 failed: ${deployProcess.error.message}`);
    process.exit(1);
  }

  if (distributionId && distributionId.length) {
    const invalidationProcess = spawnSync('aws', [
      'cloudfront', 'create-invalidation', '--distribution-id', distributionId
    ])

    if (invalidationProcess.error) {
      console.error(`Invalidation of Cloudfront failed: ${invalidationProcess.error.message}`);
      process.exit(1);
    }
  } else {
    console.warn('Cannot invalidate cloudfront because distribution id was not provided.')
  }

  console.log('Executor ran for S3Deploy', options);

  return {
    success: true,
  };
}
