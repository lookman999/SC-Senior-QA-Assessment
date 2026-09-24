import { test } from '../../fixtures/test';
import { newAccount } from '../../data/account';

test(
  'API07 - Verify Login with valid details',
  { tag: ['@required', '@api'] },
  async ({ apiSteps, registeredAccount }) => {
    const result = await apiSteps.whenLoginIsVerified(registeredAccount);
    await apiSteps.thenLoginIsAccepted(result);
  },
);

test(
  'API10 - Verify Login with invalid details',
  { tag: ['@required', '@api', '@negative'] },
  async ({ apiSteps }) => {
    const result = await apiSteps.whenLoginIsVerified(newAccount());
    await apiSteps.thenLoginIsRejected(result);
  },
);
