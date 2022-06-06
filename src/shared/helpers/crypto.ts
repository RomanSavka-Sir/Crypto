import crypto from 'crypto';

export function decrypt(key1: string, key2: string, data: string): string {
  const decipher = crypto.createDecipheriv('aes-256-ctr', getKey(key1), key2);
  return Buffer.concat([
    decipher.update(Buffer.from(data, 'hex')),
    decipher.final()
  ]).toString();
}

export function encrypt(key1: string, key2: string, data: string): string {
  const cipher = crypto.createCipheriv('aes-256-ctr', getKey(key1), key2);
  const hashCard = Buffer.concat([cipher.update(data), cipher.final()]);
  return hashCard.toString('hex');
}

export function getKey(token: string): string {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('base64')
    .substr(0, 32);
}
