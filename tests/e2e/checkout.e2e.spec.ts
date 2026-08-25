import { expect, test } from '../../src/fixtures/test.fixture';
import { CheckoutPage } from '../../src/pages/checkout.page';
import { HomePage } from '../../src/pages/home.page';
import { ProductPage } from '../../src/pages/product.page';

test.describe('Flujo de compra', () => {
  test('inicia sesión por API y llega al checkout final sin consumir stock', async ({
    authenticatedPage,
    checkoutAddress,
    testProduct,
  }) => {
    const home = new HomePage(authenticatedPage);
    const product = new ProductPage(authenticatedPage);
    const checkout = new CheckoutPage(authenticatedPage);

    await test.step('Abrir una sesión de navegador autenticada mediante API', async () => {
      await home.open();
      await home.expectAuthenticated();
    });

    await test.step('Buscar y abrir el producto seleccionado mediante API', async () => {
      await home.searchFor(testProduct.name);
      await home.openProduct(testProduct.id);
      await product.expectProduct(testProduct.name);
    });

    await test.step('Agregar exactamente una unidad al carrito', async () => {
      await product.addSingleUnitToCart();
      await product.openCart();
      await checkout.expectCartContains(testProduct.name);
    });

    await test.step('Validar que la sesión inyectada omite el formulario de login', async () => {
      await checkout.proceedFromCart();
      await checkout.expectSessionWasInjected();
      await checkout.proceedToAddress();
    });

    await test.step('Completar los datos previos al checkout con información ficticia', async () => {
      await checkout.fillFictitiousAddress(checkoutAddress);
      await checkout.proceedToPayment();
    });

    await test.step('Llegar al estado final del checkout sin confirmar la compra', async () => {
      await checkout.reachFinalCheckoutState();
      expect(testProduct.in_stock).toBe(true);
    });
  });
});
