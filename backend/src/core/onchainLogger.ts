import * as crypto from 'crypto';

export async function logDecision(data: unknown): Promise<string> {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');

  console.log('On-chain log hash:', hash);

  return hash;
}
