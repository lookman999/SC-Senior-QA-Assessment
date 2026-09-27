export class ProductPage {
  constructor(page) {
    this.page = page;
    this.information = page.locator('.product-information');
    this.price = this.information.locator('span > span');
    this.quantity = page.locator('#quantity');
    this.addButton = page.getByRole('button', { name: 'Add to cart' });
    this.addedModal = page.locator('#cartModal');
    this.addedMessage = this.addedModal.getByText('Your product has been added to cart.');
    this.continueShoppingButton = this.addedModal.getByRole('button', {
      name: 'Continue Shopping',
    });
  }
  heading(name) {
    return this.information.getByRole('heading', { name, exact: true });
  }
}
