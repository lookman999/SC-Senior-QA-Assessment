import { expect } from '@playwright/test';
import { rupeesToMinor } from '../support/money.js';
export class ProductPage {
  constructor(page) {
    this.page = page;
  }
  async add(product, quantity) {
    await this.page.goto(`/product_details/${product.id}`, { waitUntil: 'domcontentloaded' });
    const info = this.page.locator('.product-information');
    await expect(info.getByRole('heading', { name: product.name, exact: true })).toBeVisible();
    const price = await info.locator('span > span').innerText();
    expect(rupeesToMinor(price), 'UI unit price matches the catalog API').toBe(
      rupeesToMinor(product.price),
    );
    await this.page.locator('#quantity').fill(String(quantity));
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
    const modal = this.page.locator('#cartModal');
    await expect(modal.getByText('Your product has been added to cart.')).toBeVisible();
    await modal.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(modal).toBeHidden();
  }
}
