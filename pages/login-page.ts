import { expect, type Page } from '@playwright/test';
import type { Account } from '../data/account';

export class LoginPage {
  constructor(private readonly page: Page) {}
  async expectSignup() {
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }
  async expectLogin() {
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }
  async startSignup(account: Account) {
    await this.page.getByTestId('signup-name').fill(account.name);
    await this.page.getByTestId('signup-email').fill(account.email);
    await this.page.getByTestId('signup-button').click();
  }
  async login(email: string, password: string) {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-button').click();
  }
  async expectRejected() {
    await expect(
      this.page.getByText('Your email or password is incorrect!', { exact: true }),
    ).toBeVisible();
    await expect(this.page.getByRole('link', { name: /Logout/ })).toHaveCount(0);
    await expect(this.page).toHaveURL(/\/login$/);
  }
}
