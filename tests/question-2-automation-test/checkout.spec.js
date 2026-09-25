import { test } from '../../fixtures/test.js';
test('TC15 - Place Order: Register before Checkout', async ({ ui, lifecycle, catalog }) => {
  test.setTimeout(180_000); // This journey includes registration, cart, payment and deletion.
  await ui.givenHomeIsOpen();
  await ui.whenSignupIsOpened();
  await ui.whenAccountIsRegistered(lifecycle);
  await ui.thenAccountIsCreated();
  await ui.thenLoggedInAs(lifecycle.account);
  const items = await ui.whenProductsAreAdded(catalog);
  await ui.thenCartMatches(items);
  await ui.whenCheckoutIsOpened();
  await ui.thenCheckoutMatches(lifecycle.account, items);
  await ui.whenOrderIsPaid();
  await ui.thenOrderIsConfirmed();
  await ui.whenAccountIsDeleted();
  await ui.thenAccountIsDeleted();
});
