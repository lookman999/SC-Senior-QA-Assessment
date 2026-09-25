import { test, expect } from '@playwright/test';
import { formDemo } from '../../support/form-demo.js';
test.beforeEach(async ({ page }) => {
  // The supplied URL is a placeholder; this HTML is local to Q1.
  await page.route('https://example.com/form', (route) =>
    route.fulfill({ contentType: 'text/html', body: formDemo }),
  );
});
test('Q1 - submit form (two targeted fixes)', async ({ page }) => {
  await page.goto('https://example.com/form');
  // Fix 1: target the intended controls.
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('John');
  await page.getByRole('button', { name: 'Submit form', exact: true }).click();
  const successMessage = page.locator('.success-message');
  await expect(successMessage).toBeVisible();
  // Fix 2: check the required message.
  await expect(successMessage).toHaveText('Form Submitted');
});
