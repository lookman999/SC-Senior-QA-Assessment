export class CartPage {
  constructor(page) {
    this.page = page;
    this.shoppingCart = page.getByText('Shopping Cart', { exact: true });
    this.checkoutButton = page.getByText('Proceed To Checkout', { exact: true });
    this.rows = page.locator('tr[id^="product-"]');
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
}
