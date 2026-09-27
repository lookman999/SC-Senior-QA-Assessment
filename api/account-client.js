import { BaseClient } from './base-client.js';
export class AccountClient extends BaseClient {
  create(account) {
    return this.send('POST', '/api/createAccount', { ...account });
  }
  verify(email, password) {
    return this.send('POST', '/api/verifyLogin', { email, password });
  }
  delete(account) {
    return this.send('DELETE', '/api/deleteAccount', {
      email: account.email,
      password: account.password,
    });
  }
}
