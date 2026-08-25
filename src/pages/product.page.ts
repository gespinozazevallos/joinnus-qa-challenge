import { expect, type Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  async expectProduct(name: string): Promise<void> {
    await expect(this.page.getByTestId('product-name')).toHaveText(name);
    await expect(this.page.getByTestId('add-to-cart')).toBeEnabled();
  }

  async addSingleUnitToCart(): Promise<void> {
    await this.page.getByTestId('quantity').fill('1');

    const addItemResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/carts/') &&
        response.status() === 200,
    );

    await this.page.getByTestId('add-to-cart').click();
    await addItemResponse;

    await expect(this.page.getByTestId('cart-quantity')).toHaveText('1');
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('nav-cart').click();
    await expect(this.page).toHaveURL(/\/checkout$/);
  }
}
