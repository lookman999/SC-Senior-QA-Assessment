import { expect, type Page } from '@playwright/test';
import { practicePayment } from '../data/account';

export class PaymentPage {
  constructor(private readonly page: Page) {}
  async pay() {
    await expect(this.page.getByRole('heading', { name: 'Payment', exact: true })).toBeVisible();
    await this.page.getByTestId('name-on-card').fill(practicePayment.name);
    await this.page.getByTestId('card-number').fill(practicePayment.number);
    await this.page.getByTestId('cvc').fill(practicePayment.cvc);
    await this.page.getByTestId('expiry-month').fill(practicePayment.month);
    await this.page.getByTestId('expiry-year').fill(practicePayment.year);
    await this.page.getByTestId('pay-button').click();
  }
  async expectConfirmed() {
    await expect(this.page).toHaveURL(/\/payment_done\/\d+$/);
    await expect(this.page.getByTestId('order-placed')).toHaveText('Order Placed!');
    await expect(
      this.page.getByText('Congratulations! Your order has been confirmed!', { exact: true }),
    ).toBeVisible();
  }
}
