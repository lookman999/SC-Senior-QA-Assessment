export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.addressDetailsHeading = page.getByRole('heading', {
      name: 'Address Details',
      exact: true,
    });
    this.reviewHeading = page.getByRole('heading', { name: 'Review Your Order', exact: true });
    this.totalRow = page.getByRole('row').filter({ hasText: 'Total Amount' });
    this.totalPrice = this.totalRow.locator('.cart_total_price');
    this.rows = page.locator('tr[id^="product-"]');
    this.addresses = ['address_delivery', 'address_invoice'].map((id) => {
      const address = page.locator(`#${id}`);
      return {
        name: address.locator('.address_firstname.address_lastname'),
        lines: address.locator('.address_address1.address_address2'),
        city: address.locator('.address_city.address_state_name.address_postcode'),
        country: address.locator('.address_country_name'),
        phone: address.locator('.address_phone'),
      };
    });
  }
  item(product) {
    const row = this.page.locator(`#product-${product.id}`);
    return {
      name: row.getByRole('link', { name: product.name, exact: true }),
      quantity: row.locator('.cart_quantity'),
      price: row.locator('.cart_price'),
      total: row.locator('.cart_total_price'),
    };
  }
  async placeOrder(comment) {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.getByRole('link', { name: 'Place Order', exact: true }).click();
  }
}
