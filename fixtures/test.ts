import { test as base, expect } from '@playwright/test';
import { newAccount, type Account } from '../data/account';
import { CatalogClient } from '../api/catalog-client';
import { AccountClient } from '../api/account-client';
import { AccountLifecycle } from '../support/account-lifecycle';
import { ApiSteps } from '../steps/api-steps';
import { UiSteps } from '../steps/ui-steps';
import { environment } from '../support/environment';

type Fixtures = {
  catalog: CatalogClient;
  accounts: AccountClient;
  lifecycle: AccountLifecycle;
  registeredAccount: Account;
  apiSteps: ApiSteps;
  ui: UiSteps;
};

export const test = base.extend<Fixtures>({
  catalog: async ({ request }, use) => {
    await use(new CatalogClient(request));
  },
  accounts: async ({ request }, use) => {
    await use(new AccountClient(request));
  },
  lifecycle: [
    async ({ accounts }, use, info) => {
      const lifecycle = new AccountLifecycle(accounts, newAccount());
      try {
        await use(lifecycle);
      } finally {
        try {
          await lifecycle.cleanup();
        } catch {
          info.annotations.push({
            type: 'cleanup',
            description: 'Cleanup failed; run npm run cleanup using the private .runtime record.',
          });
          throw new Error(
            'Synthetic account cleanup failed. Original test errors remain in the report. Run npm run cleanup.',
          );
        }
      }
    },
    { timeout: 120_000 },
  ],
  registeredAccount: async ({ lifecycle }, use) => {
    await base.step('Given a unique account exists through API setup', () => lifecycle.create());
    await use(lifecycle.account);
  },
  apiSteps: async ({ catalog, accounts }, use) => {
    await use(new ApiSteps(catalog, accounts));
  },
  ui: async ({ page }, use) => {
    if (environment.blockAds) {
      // Optional isolation of known ad hosts only; first-party traffic is never mocked.
      await page
        .context()
        .route(
          /https:\/\/[^/]*(?:doubleclick\.net|googlesyndication\.com|googleadservices\.com)\//,
          (route) => route.abort(),
        );
    }
    await use(new UiSteps(page));
  },
});
export { expect };
