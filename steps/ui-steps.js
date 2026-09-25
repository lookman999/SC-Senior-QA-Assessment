import { test, expect } from '@playwright/test';
import { Navigation } from '../pages/navigation.js';
import { LoginPage } from '../pages/login-page.js';
import { SignupPage } from '../pages/signup-page.js';
import { ProductPage } from '../pages/product-page.js';
import { CartPage } from '../pages/cart-page.js';
import { CheckoutPage } from '../pages/checkout-page.js';
import { PaymentPage } from '../pages/payment-page.js';
import { productsSchema, validate } from '../api/contracts.js';
export class UiSteps {
  constructor(page) {
    this.nav = new Navigation(page);
    this.login = new LoginPage(page);
    this.signup = new SignupPage(page);
    this.product = new ProductPage(page);
    this.cart = new CartPage(page);
    this.checkout = new CheckoutPage(page);
    this.payment = new PaymentPage(page);
  }
  givenHomeIsOpen() {
    return test.step('Given the home page is visible', async () => {
      await this.nav.openHome();
      await this.nav.expectHome();
    });
  }
  whenSignupIsOpened() {
    return test.step('When the visitor opens signup', async () => {
      await this.nav.openLogin();
      await this.login.expectSignup();
    });
  }
  whenAccountIsRegistered(lifecycle) {
    return test.step('When the visitor registers through the UI', async () => {
      await this.login.startSignup(lifecycle.account);
      await this.signup.fill(lifecycle.account);
      lifecycle.arm();
      await this.signup.submit();
    });
  }
  thenAccountIsCreated() {
    return test.step('Then account creation is confirmed', async () => {
      await this.signup.expectCreated();
      await this.nav.continue();
    });
  }
  thenLoggedInAs(account) {
    return test.step('Then the correct user is logged in', () =>
      this.nav.expectLoggedIn(account.name));
  }
  whenUserLogsIn(email, password) {
    return test.step('When the visitor submits login credentials', async () => {
      await this.nav.openLogin();
      await this.login.expectLogin();
      await this.login.login(email, password);
    });
  }
  thenLoginIsRejected() {
    return test.step('Then login is rejected and no authenticated navigation appears', () =>
      this.login.expectRejected());
  }
  whenAccountIsDeleted() {
    return test.step('When the user deletes their account', () => this.nav.deleteAccount());
  }
  thenAccountIsDeleted(continueToHome = true) {
    return test.step('Then account deletion is confirmed', async () => {
      await this.nav.expectDeleted();
      if (continueToHome) await this.nav.continue();
    });
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
      for (const item of items) await this.product.add(item.product, item.quantity);
      return items;
    });
  }
  thenCartMatches(items) {
    return test.step('Then the cart has the exact products, quantities, prices and totals', async () => {
      await this.nav.openCart();
      await this.cart.expectCart(items);
    });
  }
  whenCheckoutIsOpened() {
    return test.step('When checkout is opened', () => this.cart.checkout());
  }
  thenCheckoutMatches(account, items) {
    return test.step('Then both addresses and the order summary match', () =>
      this.checkout.expectDetails(account, items));
  }
  whenOrderIsPaid() {
    return test.step('When an order comment and dummy payment are submitted', async () => {
      await this.checkout.placeOrder('Synthetic QA assessment order.');
      await this.payment.pay();
    });
  }
  thenOrderIsConfirmed() {
    return test.step('Then the final confirmation page reports the order placed', () =>
      this.payment.expectConfirmed());
  }
}
