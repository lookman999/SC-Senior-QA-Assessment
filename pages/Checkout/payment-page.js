import { practicePayment } from '../../data/account.js';
export class PaymentPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Payment', exact: true });
    this.orderPlaced = page.getByTestId('order-placed');
    this.confirmation = page.getByText('Congratulations! Your order has been confirmed!', {
      exact: true,
    });
  }
  async pay() {
    await this.page.getByTestId('name-on-card').fill(practicePayment.name);
    await this.page.getByTestId('card-number').fill(practicePayment.number);
    await this.page.getByTestId('cvc').fill(practicePayment.cvc);
    await this.page.getByTestId('expiry-month').fill(practicePayment.month);
    await this.page.getByTestId('expiry-year').fill(practicePayment.year);
    await this.page.getByTestId('pay-button').click();
  }
}
