import { expect } from '@playwright/test';

export async function expectSignupPage(login) {
  await expect(login.signupHeading).toBeVisible();
}

export async function expectLoginPage(login) {
  await expect(login.loginHeading).toBeVisible();
}

export async function expectSignupHeading(signup) {
  await expect(signup.formHeading).toBeVisible();
}

export async function expectSignupPrefilled(signup, account) {
  await expect(signup.nameInput).toHaveValue(account.name);
  await expect(signup.emailInput).toHaveValue(account.email);
}

export async function expectAccountCreated(signup) {
  await expect(signup.createdMessage).toHaveText('Account Created!');
}

export async function expectLoginRejected(login) {
  await expect(login.errorMessage).toBeVisible();
  await expect(login.logoutLink).toHaveCount(0);
  await expect(login.page).toHaveURL(/\/login$/);
}

export async function expectAccountDeleted(signup) {
  await expect(signup.deletedMessage).toHaveText('Account Deleted!');
}
