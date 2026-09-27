import { test } from '@playwright/test';
import { HomePage } from '../../../pages/home-page.js';
import { SiteNavigation } from '../../../pages/site-navigation.js';
import { LoginPage } from '../../../pages/Account/login-page.js';
import { SignupPage } from '../../../pages/Account/signup-page.js';
import { expectHome, expectLoggedIn } from '../../../assertions/site-ui.js';
import {
  expectSignupPage,
  expectLoginPage,
  expectSignupHeading,
  expectSignupPrefilled,
  expectAccountCreated,
  expectLoginRejected,
  expectAccountDeleted,
} from '../../../assertions/account-ui.js';

export class AccountSteps {
  constructor(page) {
    this.page = page;
    this.home = new HomePage(page);
    this.nav = new SiteNavigation(page);
    this.login = new LoginPage(page);
    this.signup = new SignupPage(page);
  }
  givenHomeIsOpen() {
    return test.step('Given the home page is visible', async () => {
      await this.page.goto('/', { waitUntil: 'domcontentloaded' });
      await expectHome(this.home);
    });
  }
  whenSignupIsOpened() {
    return test.step('When the visitor opens signup', async () => {
      await this.nav.loginLink.click();
      await expectSignupPage(this.login);
    });
  }
  whenAccountIsRegistered(lifecycle) {
    return test.step('When the visitor registers through the UI', async () => {
      await this.login.startSignup(lifecycle.account);
      await expectSignupHeading(this.signup);
      await this.signup.titleRadio.check();
      await expectSignupPrefilled(this.signup, lifecycle.account);
      await this.signup.fill(lifecycle.account);
      lifecycle.arm();
      await this.signup.createAccountButton.click();
    });
  }
  thenAccountIsCreated() {
    return test.step('Then account creation is confirmed', async () => {
      await expectAccountCreated(this.signup);
      await this.signup.continueButton.click();
    });
  }
  thenLoggedInAs(account) {
    return test.step('Then the correct user is logged in', () =>
      expectLoggedIn(this.nav, account.name));
  }
  whenUserLogsIn(email, password) {
    return test.step('When the visitor submits login credentials', async () => {
      await this.nav.loginLink.click();
      await expectLoginPage(this.login);
      await this.login.login(email, password);
    });
  }
  thenLoginIsRejected() {
    return test.step('Then login is rejected and no authenticated navigation appears', () =>
      expectLoginRejected(this.login));
  }
  whenAccountIsDeleted() {
    return test.step('When the user deletes their account', () =>
      this.nav.deleteAccountLink.click());
  }
  thenAccountIsDeleted(continueToHome = true) {
    return test.step('Then account deletion is confirmed', async () => {
      await expectAccountDeleted(this.signup);
      if (continueToHome) await this.signup.continueButton.click();
    });
  }
}
