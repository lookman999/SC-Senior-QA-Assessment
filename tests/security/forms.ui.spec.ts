import { test, expect } from '@playwright/test';

test(
  'SEC05 - login form uses HTTPS, POST, password masking and a CSRF field',
  { tag: '@security' },
  async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    const form = page.locator('form[action="/login"]');
    await expect(form).toHaveAttribute('method', /post/i);
    await expect(page.getByTestId('login-password')).toHaveAttribute('type', 'password');
    await expect(form.locator('input[name="csrfmiddlewaretoken"]')).toHaveAttribute('value', /.+/);
    expect(new URL(page.url()).protocol).toBe('https:');
    // Presence is a configuration check; enforcement needs an authorized tampering test.
  },
);
