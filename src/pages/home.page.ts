import { expect, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');

    await expect(
      this.page.getByTestId('search-query'),
    ).toBeVisible();
  }

  async expectAuthenticated(): Promise<void> {
    await expect(
      this.page.getByTestId('nav-menu'),
    ).toBeVisible();

    await expect(
      this.page.getByTestId('nav-sign-in'),
    ).toHaveCount(0);
  }

  async searchFor(query: string): Promise<void> {
    const searchInput =
      this.page.getByTestId('search-query');

    await searchInput.fill(query);

    await this.page
      .getByTestId('search-submit')
      .click();

    await expect(
      this.page.getByTestId('search-term'),
    ).toHaveText(query);

    await expect(
      this.page.getByTestId('search_completed'),
    ).toBeVisible();
  }

  async openProduct(productId: string): Promise<void> {
    const productCard =
      this.page.getByTestId(`product-${productId}`);

    await expect(productCard).toBeVisible();

    await productCard.click();

    await expect(this.page).toHaveURL(
      new RegExp(`/product/${productId}$`),
    );
  }
}