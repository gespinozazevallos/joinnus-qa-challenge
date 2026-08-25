import { ProductsApi } from '../../src/api/products.api';
import { env } from '../../src/config/env';
import { expect, test } from '../../src/fixtures/test.fixture';

test.describe('API de productos', () => {
  test('valida el mismo recurso comprable utilizado por el flujo E2E', async ({
    request,
    testProduct,
  }) => {
    const productsApi = new ProductsApi(request);

    const searchResult = await productsApi.search(env.productQuery);
    expect(searchResult.total).toBeGreaterThan(0);
    expect(
      searchResult.data.some((product) => product.id === testProduct.id),
    ).toBeTruthy();

    const product = await productsApi.getById(testProduct.id);

    expect(product).toMatchObject({
      id: testProduct.id,
      name: testProduct.name,
      in_stock: true,
      is_rental: false,
    });
    expect(product.price).toBeGreaterThan(0);
    expect(product.brand?.name).toBeTruthy();
    expect(product.category?.name).toBeTruthy();
  });
});
