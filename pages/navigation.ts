import { expect, type Page } from '@playwright/test';

export class Navigation {
  constructor(private readonly page: Page) {}
  async openHome() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }
  async expectHome() {
    await expect(
      this.page.getByRole('img', { name: 'Website for automation practice' }),
    ).toBeVisible();
    await expect(
      this.page.getByRole('heading', { name: 'Features Items', exact: true }),
    ).toBeVisible();
  }
  async openLogin() {
    await this.page.getByRole('link', { name: /Signup \/ Login/ }).click();
  }
  async openCart() {
    await this.page.locator('header').getByRole('link', { name: /Cart/ }).click();
  }
  async expectLoggedIn(name: string) {
    await expect(
      this.page.locator('header').getByText(`Logged in as ${name}`, { exact: true }),
    ).toBeVisible();
  }
  async deleteAccount() {
    await this.page.getByRole('link', { name: /Delete Account/ }).click();
  }
  async expectDeleted() {
    await expect(this.page.getByTestId('account-deleted')).toHaveText('Account Deleted!');
  }
  async continue() {
    await this.page.getByTestId('continue-button').click();
  }
}
