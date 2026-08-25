import type { APIRequestContext } from '@playwright/test';
import { env } from '../config/env';
import type { PaginatedProductsResponse, ProductResponse } from '../types/api';

export class ProductsApi {
  constructor(private readonly request: APIRequestContext) {}

  async search(query: string): Promise<PaginatedProductsResponse> {
    const normalizedQuery = query?.trim();

    if (!normalizedQuery) {
      throw new Error('El criterio de búsqueda del producto no puede estar vacío.');
    }

    const response = await this.request.get(`${env.apiBaseUrl}/products/search`, {
      params: { q: normalizedQuery },
    });

    if (!response.ok()) {
      throw new Error(
        `La búsqueda de productos falló: ${response.status()} ${response.statusText()} - ${await response.text()}`,
      );
    }

    return (await response.json()) as PaginatedProductsResponse;
  }

  async getById(productId: string): Promise<ProductResponse> {
    const response = await this.request.get(`${env.apiBaseUrl}/products/${productId}`);

    if (!response.ok()) {
      throw new Error(
        `La consulta del producto falló: ${response.status()} ${response.statusText()} - ${await response.text()}`,
      );
    }

    return (await response.json()) as ProductResponse;
  }

  async resolvePurchasableProduct(query: string): Promise<ProductResponse> {
    const result = await this.search(query);

    const product = [...result.data]
      .filter((candidate) => candidate.in_stock && !candidate.is_rental)
      .sort(
        (left, right) =>
          left.name.localeCompare(right.name) || left.id.localeCompare(right.id),
      )[0];

    if (!product) {
      throw new Error(
        `No se encontró un producto con stock disponible y que no sea alquilable para la búsqueda: "${query}".`,
      );
    }

    return product;
  }
}
