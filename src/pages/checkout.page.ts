import { expect, type Page } from '@playwright/test';
import type { CheckoutAddress } from '../types/checkout';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectCartContains(productName: string): Promise<void> {
    await expect(this.page.getByTestId('product-title')).toContainText(productName);
    await expect(this.page.getByTestId('product-quantity')).toHaveValue('1');
    await expect(this.page.getByTestId('cart-total')).toContainText('$');
  }

  async proceedFromCart(): Promise<void> {
    await this.page.getByTestId('proceed-1').click();
    await expect(this.page.getByTestId('proceed-2')).toBeVisible();
  }

  async expectSessionWasInjected(): Promise<void> {
    await expect(this.page.getByTestId('login-submit')).toHaveCount(0);
    await expect(this.page.getByTestId('email')).toHaveCount(0);
    await expect(this.page.getByTestId('password')).toHaveCount(0);
    await expect(this.page.getByTestId('proceed-2')).toBeEnabled();
  }

  async proceedToAddress(): Promise<void> {
    await this.page.getByTestId('proceed-2').click();
    await expect(this.page.getByTestId('country')).toBeVisible();
  }

  async fillFictitiousAddress(address: CheckoutAddress): Promise<void> {
    const country = this.page.getByTestId('country');
    const postalCode = this.page.getByTestId('postal_code');
    const houseNumber = this.page.getByTestId('house_number');
    const street = this.page.getByTestId('street');
    const city = this.page.getByTestId('city');
    const state = this.page.getByTestId('state');

    await country.selectOption(address.countryCode);
    await postalCode.fill(address.postalCode);

    const postcodeLookup = this.page
      .waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          response.url().includes('/postcode-lookup'),
        { timeout: 5_000 },
      )
      .catch(() => null);

    await houseNumber.fill(address.houseNumber);
    await postcodeLookup;

    await street.fill(address.street);
    await city.fill(address.city);
    await state.fill(address.state);

    await expect(country).toHaveValue(address.countryCode);
    await expect(postalCode).toHaveValue(address.postalCode);
    await expect(houseNumber).toHaveValue(address.houseNumber);
    await expect(street).toHaveValue(address.street);
    await expect(city).toHaveValue(address.city);
    await expect(state).toHaveValue(address.state);
    await expect(this.page.getByTestId('proceed-3')).toBeEnabled();
  }

  async proceedToPayment(): Promise<void> {
    await this.page.getByTestId('proceed-3').click();
    await expect(this.page.getByTestId('payment-method')).toBeVisible();
  }

  async reachFinalCheckoutState(): Promise<void> {
    await this.page.getByTestId('payment-method').selectOption('cash-on-delivery');

    await expect(this.page.getByTestId('payment-method')).toHaveValue(
      'cash-on-delivery',
    );
    await expect(this.page.getByTestId('finish')).toBeVisible();
    await expect(this.page.getByTestId('finish')).toBeEnabled();
    await expect(this.page.locator('#order-confirmation')).toHaveCount(0);
  }
}
