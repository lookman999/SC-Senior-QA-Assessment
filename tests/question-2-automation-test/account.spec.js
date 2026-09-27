import { test } from '../../fixtures/test.js';
import { newAccount } from '../../data/account.js';
test('TC01 - Register User', async ({ ui, lifecycle }) => {
  await ui.account.givenHomeIsOpen();
  await ui.account.whenSignupIsOpened();
  await ui.account.whenAccountIsRegistered(lifecycle);
  await ui.account.thenAccountIsCreated();
  await ui.account.thenLoggedInAs(lifecycle.account);
  await ui.account.whenAccountIsDeleted();
  await ui.account.thenAccountIsDeleted();
});
test('TC02 - Login User with correct email and password', async ({ ui, registeredAccount }) => {
  await ui.account.givenHomeIsOpen();
  await ui.account.whenUserLogsIn(registeredAccount.email, registeredAccount.password);
  await ui.account.thenLoggedInAs(registeredAccount);
  await ui.account.whenAccountIsDeleted();
  await ui.account.thenAccountIsDeleted(false);
});
test('TC03 - Login User with incorrect email and password', async ({ ui }) => {
  const unknownAccount = newAccount();
  await ui.account.givenHomeIsOpen();
  await ui.account.whenUserLogsIn(unknownAccount.email, unknownAccount.password);
  await ui.account.thenLoginIsRejected();
});
