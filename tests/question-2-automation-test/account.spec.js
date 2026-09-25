import { test } from '../../fixtures/test.js';
import { newAccount } from '../../data/account.js';
test('TC01 - Register User', async ({ ui, lifecycle }) => {
  await ui.givenHomeIsOpen();
  await ui.whenSignupIsOpened();
  await ui.whenAccountIsRegistered(lifecycle);
  await ui.thenAccountIsCreated();
  await ui.thenLoggedInAs(lifecycle.account);
  await ui.whenAccountIsDeleted();
  await ui.thenAccountIsDeleted();
});
test('TC02 - Login User with correct email and password', async ({ ui, registeredAccount }) => {
  await ui.givenHomeIsOpen();
  await ui.whenUserLogsIn(registeredAccount.email, registeredAccount.password);
  await ui.thenLoggedInAs(registeredAccount);
  await ui.whenAccountIsDeleted();
  await ui.thenAccountIsDeleted(false);
});
test('TC03 - Login User with incorrect email and password', async ({ ui }) => {
  const unknownAccount = newAccount();
  await ui.givenHomeIsOpen();
  await ui.whenUserLogsIn(unknownAccount.email, unknownAccount.password);
  await ui.thenLoginIsRejected();
});
