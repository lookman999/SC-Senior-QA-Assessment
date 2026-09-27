# Q1 — broken form test

## Issues found

1. `input[type="text"]` is broad. Another text input could make the locator ambiguous or receive the name.
2. `button` is broad. Another button could be clicked instead of Submit.
3. Visibility alone does not prove the toast says `Form Submitted`; an unrelated message could pass.
4. The test never checks that the toast is absent before submission. A stale toast could pass.

## Proposed fixes

1. Locate the name field and Submit button by their accessible roles and names.
2. Verify that the success message is visible and contains the exact expected text.

```javascript
test('submit form', async ({ page }) => {
  await page.goto('https://example.com/form');
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('John');
  await page.getByRole('button', { name: 'Submit form', exact: true }).click();
  const successMessage = page.locator('.success-message');
  await expect(successMessage).toBeVisible();
  await expect(successMessage).toHaveText('Form Submitted');
});
```
