export class SignupPage {
  constructor(page) {
    this.page = page;
    this.formHeading = page.getByText('Enter Account Information', { exact: true });
    this.titleRadio = page.getByLabel('Mr.', { exact: true });
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.createAccountButton = page.getByTestId('create-account');
    this.createdMessage = page.getByTestId('account-created');
    this.deletedMessage = page.getByTestId('account-deleted');
    this.continueButton = page.getByTestId('continue-button');
  }
  async fill(account) {
    await this.page.getByTestId('password').fill(account.password);
    await this.page.getByTestId('days').selectOption(account.birth_date);
    await this.page.getByTestId('months').selectOption(account.birth_month);
    await this.page.getByTestId('years').selectOption(account.birth_year);
    await this.page.getByLabel('Sign up for our newsletter!').check();
    await this.page.getByLabel('Receive special offers from our partners!').check();
    const fields = {
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
}
