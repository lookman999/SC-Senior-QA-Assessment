import { test as base } from '@playwright/test';
import { newAccount } from '../data/account.js';
import { CatalogClient } from '../api/catalog-client.js';
import { AccountClient } from '../api/account-client.js';
import { AccountLifecycle } from '../support/account-lifecycle.js';
import { ApiSteps } from '../steps/api-steps.js';
import { UiSteps } from '../steps/ui-steps.js';
export const test = base.extend({
  catalog: async ({ request }, use) => {
    await use(new CatalogClient(request));
  },
  accounts: async ({ request }, use) => {
    await use(new AccountClient(request));
  },
  lifecycle: async ({ accounts }, use) => {
    const lifecycle = new AccountLifecycle(accounts, newAccount());
    try {
      await use(lifecycle);
    } finally {
      await lifecycle.cleanup();
    }
  },
  registeredAccount: async ({ lifecycle }, use) => {
    await base.step('Given a unique account exists through API setup', () => lifecycle.create());
    await use(lifecycle.account);
  },
  apiSteps: async ({ catalog, accounts }, use) => {
    await use(new ApiSteps(catalog, accounts));
  },
  ui: async ({ page }, use) => {
    // The practice site's third-party ad survey can cover checkout controls.
    await page
      .context()
      .route(
        /https:\/\/[^/]*(?:doubleclick\.net|googlesyndication\.com|googleadservices\.com|fundingchoicesmessages\.google\.com)\//,
        (route) => route.abort(),
      );
    await use(new UiSteps(page));
  },
});
