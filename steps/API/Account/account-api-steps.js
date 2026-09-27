import { test } from '@playwright/test';
import { expectMessage } from '../../../assertions/account-api.js';

export class AccountApiSteps {
  constructor(accounts) {
    this.accounts = accounts;
  }
  whenLoginIsVerified(account) {
    return test.step('When login credentials are verified by API', () =>
      this.accounts.verify(account.email, account.password));
  }
  thenLoginIsAccepted(result) {
    return test.step('Then responseCode is 200 and the user exists', () =>
      expectMessage(result, 200, 'User exists!'));
  }
  thenLoginIsRejected(result) {
    return test.step('Then responseCode is 404 and the user is rejected', () =>
      expectMessage(result, 404, 'User not found!'));
  }
}
