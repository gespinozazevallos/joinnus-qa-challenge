import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
  }

  return value;
}

function requiredUrl(name: string): string {
  const value = required(name);

  try {
    return new URL(value).toString().replace(/\/$/, '');
  } catch {
    throw new Error(`${name} debe ser una URL absoluta. Valor recibido: ${value}`);
  }
}

export const env = Object.freeze({
  webBaseUrl: requiredUrl('WEB_BASE_URL'),
  apiBaseUrl: requiredUrl('API_BASE_URL'),
  userEmail: required('TEST_USER_EMAIL'),
  userPassword: required('TEST_USER_PASSWORD'),
  authStorageKey: process.env.AUTH_STORAGE_KEY?.trim() || 'auth-token',
  productQuery: process.env.PRODUCT_QUERY?.trim() || 'pliers',
});
