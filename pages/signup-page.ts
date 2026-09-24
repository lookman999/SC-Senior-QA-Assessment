import { expect, type Page } from '@playwright/test';
import type { Account } from '../data/account';

export class SignupPage {
  constructor(private readonly page: Page) {}
  async fill(account: Account) {
    await expect(this.page.getByText('Enter Account Information', { exact: true })).toBeVisible();
    await this.page.getByLabel('Mr.', { exact: true }).check();
    await expect(this.page.getByTestId('name')).toHaveValue(account.name);
    await expect(this.page.getByTestId('email')).toHaveValue(account.email);
    await this.page.getByTestId('password').fill(account.password);
    await this.page.getByTestId('days').selectOption(account.birth_date);
    await this.page.getByTestId('months').selectOption(account.birth_month);
    await this.page.getByTestId('years').selectOption(account.birth_year);
    await this.page.getByLabel('Sign up for our newsletter!').check();
    await this.page.getByLabel('Receive special offers from our partners!').check();
    const fields: Record<string, string> = {
      first_name: account.firstname,
      last_name: account.lastname,
      company: account.company,
      address: account.address1,
      address2: account.address2,
      state: account.state,
      city: account.city,
      zipcode: account.zipcode,
      mobile_number: account.mobile_number,
    };
    for (const [testId, value] of Object.entries(fields))
      await this.page.getByTestId(testId).fill(value);
    await this.page.getByTestId('country').selectOption({ label: account.country });
  }
  async submit() {
    await this.page.getByTestId('create-account').click();
  }
  async expectCreated() {
    await expect(this.page.getByTestId('account-created')).toHaveText('Account Created!');
  }
}
