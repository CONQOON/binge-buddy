import * as path from 'path';
import { spawnSync } from 'child_process';
import { TerraformExecutorSchema } from './schema';


export default async function runExecutor(options: TerraformExecutorSchema) {
  try {
    // Define the working directory (cwd)
    const cwd = path.join(process.cwd(), 'infra/terraform');

    // Change to the provided environment or use the current directory
    if (options.env && !/^workspace/.test(options.command)) {

      const changeEnvResult = spawnSync('terraform', ['workspace', 'select', options.env], {
        encoding: 'utf-8',
        cwd,
        stdio: 'inherit', // Forward Terraform output to executor output
      });

      if (changeEnvResult.error) {
        throw changeEnvResult.error;
      }

      console.log(`Changed terraform workspace successfully to ${options.env}:`);
    }

    // Build the Terraform command
    // const terraformCmd = `terraform ${options.command} ${options._?.join(' ') ?? ''}`;

    // Execute the Terraform command with the specified working directory
    const terraformCmdOutput = spawnSync('terraform', [options.command, ...options._ ?? []], {
      encoding: 'utf-8',
      cwd,
      stdio: 'inherit', // Forward Terraform output to executor output
      shell: true, // Use shell for better output handling
    });

    if (terraformCmdOutput.error) {
      throw terraformCmdOutput.error;
    }

    return {
      success: terraformCmdOutput.status === 0,
    };
  } catch (error) {
    console.error(`Error executing Terraform command "${options.command}":`);
    console.error(error.message);
    return {
      success: false,
    };
  }
}
