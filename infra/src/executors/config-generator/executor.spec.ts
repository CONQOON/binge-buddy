import { ConfigGeneratorExecutorSchema } from './schema';
import executor from './executor';

const options: ConfigGeneratorExecutorSchema = {};

describe('ConfigGenerator Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
