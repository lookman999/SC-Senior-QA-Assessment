export class SiteNavigation {
  constructor(page) {
    this.header = page.locator('header');
    this.loginLink = page.getByRole('link', { name: /Signup \/ Login/ });
    this.cartLink = this.header.getByRole('link', { name: /Cart/ });
    this.deleteAccountLink = page.getByRole('link', { name: /Delete Account/ });
  }
  loggedInAs(name) {
    return this.header.getByText(`Logged in as ${name}`, { exact: true });
  }
}
