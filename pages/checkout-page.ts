import { expect, type Page } from '@playwright/test';
import type { Account } from '../data/account';
import { expectCartRows, type CartItem } from './cart-page';
import { rupeesToMinor } from '../support/money';

export class CheckoutPage {
  constructor(private readonly page: Page) {}
  async expectDetails(account: Account, items: CartItem[]) {
    await expect(
      this.page.getByRole('heading', { name: 'Address Details', exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole('heading', { name: 'Review Your Order', exact: true }),
    ).toBeVisible();
    for (const id of ['address_delivery', 'address_invoice']) {
      const address = this.page.locator(`#${id}`);
      await expect(address.locator('.address_firstname.address_lastname')).toHaveText(
        `Mr. ${account.firstname} ${account.lastname}`,
      );
      await expect(address.locator('.address_address1.address_address2')).toHaveText([
        account.company,
        account.address1,
        account.address2,
      ]);
      await expect(address.locator('.address_city.address_state_name.address_postcode')).toHaveText(
        `${account.city} ${account.state} ${account.zipcode}`,
      );
      await expect(address.locator('.address_country_name')).toHaveText(account.country);
      await expect(address.locator('.address_phone')).toHaveText(account.mobile_number);
    }
    await expectCartRows(this.page, items);
    const totalRow = this.page.getByRole('row').filter({ hasText: 'Total Amount' });
    const expected = items.reduce(
      (sum, item) => sum + rupeesToMinor(item.product.price) * item.quantity,
      0,
    );
    expect(
      rupeesToMinor(await totalRow.locator('.cart_total_price').innerText()),
      'Order total equals sum of line totals',
    ).toBe(expected);
  }
  async placeOrder(comment: string) {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.getByRole('link', { name: 'Place Order', exact: true }).click();
  }
}
