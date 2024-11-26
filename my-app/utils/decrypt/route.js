import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'fallbackSecretKey');

export async function decrypt(token) {
  try {
    if (!token) {
      console.error('No token provided for decryption.');
      return null;
    }
    //Uses Algorhithm to decrypt the payload aka the session data
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
    console.log('Decrypted session payload:', payload); // Debugging log
    return payload;
  } catch (error) {
    console.error('Failed to decrypt token:', error.message);
    return null;
  }
}
