import { expect } from '@playwright/test';

export async function expectHome(home) {
  await expect(home.logo).toBeVisible();
  await expect(home.featuresHeading).toBeVisible();
}

export async function expectLoggedIn(navigation, name) {
  await expect(navigation.loggedInAs(name)).toBeVisible();
}
