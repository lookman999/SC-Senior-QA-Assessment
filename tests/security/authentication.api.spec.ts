import { test, expect } from '../../fixtures/test';
import { newAccount } from '../../data/account';
import { expectMessage } from '../../support/api-assertions';

test(
  'SEC01 - wrong password and unknown account have the same public error',
  { tag: '@security' },
  async ({ accounts, registeredAccount }) => {
    const wrongPassword = await accounts.verify(
      registeredAccount.email,
      `${registeredAccount.password}-wrong`,
    );
    const unknown = newAccount();
    const unknownUser = await accounts.verify(unknown.email, unknown.password);
    expectMessage(wrongPassword, 404, 'User not found!');
    expectMessage(unknownUser, 404, 'User not found!');
    expect(wrongPassword.body).toEqual(unknownUser.body);
    // Equal messages are one signal only; this does not prove timing-attack resistance.
  },
);

test(
  'SEC02 - missing email is rejected without reflecting the password',
  { tag: '@security' },
  async ({ accounts }) => {
    const account = newAccount();
    const result = await accounts.verifyWithoutEmail(account.password);
    expectMessage(
      result,
      400,
      'Bad request, email or password parameter is missing in POST request.',
    );
    expect(
      JSON.stringify(result.body).includes(account.password),
      'Password is not reflected',
    ).toBe(false);
  },
);

test(
  'SEC03 - successful verify response exposes no extra account fields',
  { tag: '@security' },
  async ({ accounts, registeredAccount }) => {
    const result = await accounts.verify(registeredAccount.email, registeredAccount.password);
    expectMessage(result, 200, 'User exists!');
    // Inspect the raw object: schema parsing would otherwise discard extra fields.
    expect(Object.keys(result.body as object).sort()).toEqual(['message', 'responseCode']);
  },
);

test(
  'SEC04 - search requires its documented parameter',
  { tag: '@security' },
  async ({ catalog }) => {
    expectMessage(
      await catalog.searchWithoutParameter(),
      400,
      'Bad request, search_product parameter is missing in POST request.',
    );
  },
);
