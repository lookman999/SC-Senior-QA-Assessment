export class LoginPage {
  constructor(page) {
    this.page = page;
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.errorMessage = page.getByText('Your email or password is incorrect!', { exact: true });
    this.logoutLink = page.getByRole('link', { name: /Logout/ });
  }
  async startSignup(account) {
    await this.page.getByTestId('signup-name').fill(account.name);
    await this.page.getByTestId('signup-email').fill(account.email);
    await this.page.getByTestId('signup-button').click();
  }
  async login(email, password) {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-button').click();
  }
}
