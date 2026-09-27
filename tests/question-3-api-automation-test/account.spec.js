import { test } from '../../fixtures/test.js';
import { newAccount } from '../../data/account.js';
test('API07 - Verify Login with valid details', async ({ apiSteps, registeredAccount }) => {
  const result = await apiSteps.account.whenLoginIsVerified(registeredAccount);
  await apiSteps.account.thenLoginIsAccepted(result);
});
test('API10 - Verify Login with invalid details', async ({ apiSteps }) => {
  const result = await apiSteps.account.whenLoginIsVerified(newAccount());
  await apiSteps.account.thenLoginIsRejected(result);
});
