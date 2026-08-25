import { randomInt } from 'node:crypto';
import type { CheckoutAddress } from '../types/checkout';

const streetNames = [
  'Automation Avenue',
  'Quality Street',
  'Regression Road',
  'Playwright Lane',
  'Test Data Way',
] as const;

export function createCheckoutAddress(): CheckoutAddress {
  const street = streetNames[randomInt(0, streetNames.length)];
  const uniqueSuffix = randomInt(100, 10_000);

  return {
    countryCode: 'PE',
    postalCode: String(randomInt(15000, 15100)),
    houseNumber: String(randomInt(100, 999)),
    street: `${street} ${uniqueSuffix}`,
    city: 'Lima',
    state: 'Lima',
  };
}
