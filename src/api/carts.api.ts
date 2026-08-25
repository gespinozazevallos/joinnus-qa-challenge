import { type APIRequestContext } from '@playwright/test';
import { env } from '../config/env';

export class CartsApi {
  constructor(
    private readonly request: APIRequestContext,
  ) {}

  async deleteBestEffort(
    cartId: string,
    token: string,
  ): Promise<void> {
    try {
      const response = await this.request.delete(
        `${env.apiBaseUrl}/carts/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 3_000,
        },
      );

      if (!response.ok()) {
        console.warn(
          `Se omitió la limpieza del carrito. DELETE /carts/${cartId} devolvió ${response.status()}.`,
        );
      }
    } catch {
      console.warn(
        `Se omitió la limpieza del carrito. DELETE /carts/${cartId} no pudo completarse.`,
      );
    }
  }
}