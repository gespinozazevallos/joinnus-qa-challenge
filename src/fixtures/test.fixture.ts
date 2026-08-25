import { test as base, type Page } from '@playwright/test';
import { AuthApi } from '../api/auth.api';
import { CartsApi } from '../api/carts.api';
import { ProductsApi } from '../api/products.api';
import { env } from '../config/env';
import { createCheckoutAddress } from '../data/test-data.factory';
import type { ProductResponse } from '../types/api';
import type { CheckoutAddress } from '../types/checkout';

type ChallengeFixtures = {
  authToken: string;
  authenticatedPage: Page;
  checkoutAddress: CheckoutAddress;
  testProduct: ProductResponse;
};

export const test = base.extend<ChallengeFixtures>({
  authToken: async ({ request }, use) => {
    const authApi = new AuthApi(request);
    const token = await authApi.login(env.userEmail, env.userPassword);

    await authApi.getCurrentUser(token);
    await use(token);
  },

  testProduct: async ({ request }, use) => {
    const product = await new ProductsApi(request).resolvePurchasableProduct(
      env.productQuery,
    );
    await use(product);
  },

  checkoutAddress: async ({}, use) => {
    await use(createCheckoutAddress());
  },

  authenticatedPage: async ({ page, request, authToken }, use) => {
    await page.addInitScript(
      ({ storageKey, token }) => {
        window.localStorage.setItem(storageKey, token);
        window.localStorage.setItem('language', 'en');
      },
      { storageKey: env.authStorageKey, token: authToken },
    );

    await use(page);

    const cartId = await page
      .evaluate(() => window.sessionStorage.getItem('cart_id'))
      .catch(() => null);

    if (cartId) {
      await new CartsApi(request).deleteBestEffort(cartId, authToken);
    }
  },
});

export { expect } from '@playwright/test';
