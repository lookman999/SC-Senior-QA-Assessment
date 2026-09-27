import { test, expect } from '@playwright/test';
import { SiteNavigation } from '../../../pages/site-navigation.js';
import { ProductPage } from '../../../pages/Checkout/product-page.js';
import { CartPage } from '../../../pages/Checkout/cart-page.js';
import { CheckoutPage } from '../../../pages/Checkout/checkout-page.js';
import { PaymentPage } from '../../../pages/Checkout/payment-page.js';
import { productsSchema, validate } from '../../../api/contracts.js';
import {
  expectProductDetails,
  expectProductAdded,
  expectProductModalClosed,
  expectCart,
  expectCheckoutDetails,
  expectPaymentPage,
  expectOrderConfirmed,
} from '../../../assertions/checkout-ui.js';

export class CheckoutSteps {
  constructor(page) {
    this.page = page;
    this.nav = new SiteNavigation(page);
    this.product = new ProductPage(page);
    this.cart = new CartPage(page);
    this.checkout = new CheckoutPage(page);
    this.payment = new PaymentPage(page);
  }
  whenProductsAreAdded(catalog) {
    return test.step('When two distinct products with quantities 2 and 1 are added', async () => {
      const result = await catalog.products();
      expect(result.httpStatus).toBe(200);
      const { products } = validate(productsSchema, result.body);
      expect(products.length).toBeGreaterThanOrEqual(2);
      const items = products
        .slice(0, 2)
        .map((product, index) => ({ product, quantity: index === 0 ? 2 : 1 }));
      for (const { product, quantity } of items) {
        await this.page.goto(`/product_details/${product.id}`, { waitUntil: 'domcontentloaded' });
        await expectProductDetails(this.product, product);
        await this.product.quantity.fill(String(quantity));
        await this.product.addButton.click();
        await expectProductAdded(this.product);
        await this.product.continueShoppingButton.click();
        await expectProductModalClosed(this.product);
      }
      return items;
    });
  }
  thenCartMatches(items) {
    return test.step('Then the cart has the exact products, quantities, prices and totals', async () => {
      await this.nav.cartLink.click();
      await expectCart(this.cart, items);
    });
  }
  whenCheckoutIsOpened() {
    return test.step('When checkout is opened', () => this.cart.checkoutButton.click());
  }
  thenCheckoutMatches(account, items) {
    return test.step('Then both addresses and the order summary match', () =>
      expectCheckoutDetails(this.checkout, account, items));
  }
  whenOrderIsPaid() {
    return test.step('When an order comment and dummy payment are submitted', async () => {
      await this.checkout.placeOrder('Synthetic QA assessment order.');
      await expectPaymentPage(this.payment);
      await this.payment.pay();
    });
  }
  thenOrderIsConfirmed() {
    return test.step('Then the final confirmation page reports the order placed', () =>
      expectOrderConfirmed(this.payment));
  }
}
