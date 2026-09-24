import { test, expect } from '@playwright/test';
import { formDemo } from '../../support/form-demo';

test.beforeEach(async ({ page }) => {
  // The brief supplies no real form. This route is an explicitly local demonstration.
  await page.route('https://example.com/form', (route) =>
    route.fulfill({ contentType: 'text/html', body: formDemo }),
  );
});

test(
  'Q1 - submit form (two targeted fixes)',
  { tag: ['@required', '@debugging'] },
  async ({ page }) => {
    await page.goto('https://example.com/form');

    // Fix 1: identify the intended controls; the demo deliberately has other inputs/buttons.
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('John');
    await page.getByRole('button', { name: 'Submit form', exact: true }).click();

    const successMessage = page.locator('.success-message');
    await expect(successMessage).toBeVisible();
    // Fix 2: visible is insufficient; verify the required business message.
    await expect(successMessage).toHaveText('Form Submitted');
  },
);
