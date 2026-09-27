import { expect } from '@playwright/test';
import { rupeesToMinor } from '../utils/money.js';

export async function expectProductDetails(productPage, product) {
  await expect(productPage.heading(product.name)).toBeVisible();
  const price = await productPage.price.innerText();
  expect(rupeesToMinor(price), 'UI unit price matches the catalog API').toBe(
    rupeesToMinor(product.price),
  );
}

export async function expectProductAdded(productPage) {
  await expect(productPage.addedMessage).toBeVisible();
}

export async function expectProductModalClosed(productPage) {
  await expect(productPage.addedModal).toBeHidden();
}

export async function expectCartRows(cart, items) {
  await expect(cart.rows).toHaveCount(items.length);

  for (const { product, quantity } of items) {
    const item = cart.item(product);
    await expect(item.name).toBeVisible();
    await expect(item.quantity).toHaveText(String(quantity));
    expect(rupeesToMinor(await item.price.innerText())).toBe(rupeesToMinor(product.price));
    // Integer minor units avoid floating point errors in money calculations.
    expect(rupeesToMinor(await item.total.innerText())).toBe(
      rupeesToMinor(product.price) * quantity,
    );
  }
}

export async function expectCart(cart, items) {
  await expect(cart.page).toHaveURL(/\/view_cart$/);
  await expect(cart.shoppingCart).toBeVisible();
  await expectCartRows(cart, items);
}

export async function expectCheckoutDetails(checkout, account, items) {
  await expect(checkout.addressDetailsHeading).toBeVisible();
  await expect(checkout.reviewHeading).toBeVisible();
  for (const address of checkout.addresses) {
    await expect(address.name).toHaveText(`Mr. ${account.firstname} ${account.lastname}`);
    await expect(address.lines).toHaveText([account.company, account.address1, account.address2]);
    await expect(address.city).toHaveText(`${account.city} ${account.state} ${account.zipcode}`);
    await expect(address.country).toHaveText(account.country);
    await expect(address.phone).toHaveText(account.mobile_number);
  }
  await expectCartRows(checkout, items);
  const expected = items.reduce(
    (sum, item) => sum + rupeesToMinor(item.product.price) * item.quantity,
    0,
  );
  expect(
    rupeesToMinor(await checkout.totalPrice.innerText()),
    'Order total equals sum of line totals',
  ).toBe(expected);
}

export async function expectPaymentPage(payment) {
  await expect(payment.heading).toBeVisible();
}

export async function expectOrderConfirmed(payment) {
  await expect(payment.page).toHaveURL(/\/payment_done\/\d+$/);
  await expect(payment.orderPlaced).toHaveText('Order Placed!');
  await expect(payment.confirmation).toBeVisible();
}
