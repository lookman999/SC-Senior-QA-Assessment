import { expect } from '@playwright/test';
import { rupeesToMinor } from '../support/money.js';
export async function expectCartRows(page, items) {
  const rows = page.locator('tr[id^="product-"]');
  await expect(rows).toHaveCount(items.length);
  for (const { product, quantity } of items) {
    const row = page.locator(`#product-${product.id}`);
    await expect(row.getByRole('link', { name: product.name, exact: true })).toBeVisible();
    await expect(row.locator('.cart_quantity')).toHaveText(String(quantity));
    expect(rupeesToMinor(await row.locator('.cart_price').innerText())).toBe(
      rupeesToMinor(product.price),
    );
    // Integer minor units avoid floating point errors in money calculations.
    expect(rupeesToMinor(await row.locator('.cart_total_price').innerText())).toBe(
      rupeesToMinor(product.price) * quantity,
    );
  }
}
export class CartPage {
  constructor(page) {
    this.page = page;
  }
  async expectCart(items) {
    await expect(this.page).toHaveURL(/\/view_cart$/);
    await expect(this.page.getByText('Shopping Cart', { exact: true })).toBeVisible();
    await expectCartRows(this.page, items);
  }
  async checkout() {
    await this.page.getByText('Proceed To Checkout', { exact: true }).click();
  }
}
