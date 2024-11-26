import { SignJWT } from 'jose';

const secretKey = process.env.JWT_SECRET || 'fallbackSecretKey';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(encodedKey);
}
