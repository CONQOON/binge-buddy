import * as _ from 'lodash';
import { ConfigGeneratorExecutorSchema } from './schema';
import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

export default async function runExecutor(options: ConfigGeneratorExecutorSchema) {

  try {
    const cwd = process.cwd()

    const terraformDir = join(cwd, 'infra', 'terraform');
    const awsExportsPath = join(cwd, 'config', 'aws.json');

    // Run terraform output -json and capture the JSON output
    const terraformOutput = spawnSync('terraform', ['output', '-json'], {cwd: terraformDir});

    if (terraformOutput.status !== 0) {
      throw new Error(`Error running 'terraform output -json'`);
    }

    const terraformJSON = JSON.parse(terraformOutput.stdout.toString('utf-8'));

    // Write the AWS exports to the specified file with pretty printing
    writeFileSync(awsExportsPath, JSON.stringify(_.mapValues(terraformJSON, 'value')), 'utf-8');

    console.log(`Configuration files generated successfully.`);

    return {
      success: true,
    };
  } catch (error) {
    // Log errors with context
    console.error(`Error: ${error.message}`);
    return {
      success: false,
    };
  }
}
