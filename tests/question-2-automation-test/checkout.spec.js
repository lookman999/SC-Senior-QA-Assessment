import { test } from '../../fixtures/test.js';
test('TC15 - Place Order: Register before Checkout', async ({ ui, lifecycle, catalog }) => {
  test.setTimeout(180_000); // This journey includes registration, cart, payment and deletion.
  await ui.account.givenHomeIsOpen();
  await ui.account.whenSignupIsOpened();
  await ui.account.whenAccountIsRegistered(lifecycle);
  await ui.account.thenAccountIsCreated();
  await ui.account.thenLoggedInAs(lifecycle.account);
  const items = await ui.checkout.whenProductsAreAdded(catalog);
  await ui.checkout.thenCartMatches(items);
  await ui.checkout.whenCheckoutIsOpened();
  await ui.checkout.thenCheckoutMatches(lifecycle.account, items);
  await ui.checkout.whenOrderIsPaid();
  await ui.checkout.thenOrderIsConfirmed();
  await ui.account.whenAccountIsDeleted();
  await ui.account.thenAccountIsDeleted();
});
