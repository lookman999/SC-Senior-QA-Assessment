import type { Account } from '../data/account';
import { BaseClient } from './base-client';

export class AccountClient extends BaseClient {
  create(account: Account) {
    return this.send('POST', '/api/createAccount', { ...account });
  }
  verify(email: string, password: string) {
    return this.send('POST', '/api/verifyLogin', { email, password });
  }
  verifyWithoutEmail(password: string) {
    return this.send('POST', '/api/verifyLogin', { password });
  }
  delete(account: Pick<Account, 'email' | 'password'>) {
    return this.send('DELETE', '/api/deleteAccount', {
      email: account.email,
      password: account.password,
    });
  }
}
