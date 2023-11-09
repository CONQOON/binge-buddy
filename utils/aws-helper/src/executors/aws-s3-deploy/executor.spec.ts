import { S3DeployExecutorSchema } from './schema';
import executor from './executor';

const options: S3DeployExecutorSchema = {};

describe('S3Deploy Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
