import { expectMessage } from './api-assertions.js';
import { messageSchema, validate } from '../api/contracts.js';
export class AccountLifecycle {
  armed = false;
  constructor(api, account) {
    this.api = api;
    this.account = account;
  }
  arm() {
    this.armed = true;
  }
  async create() {
    this.arm();
    expectMessage(await this.api.create(this.account), 201, 'User created!');
  }
  async cleanup() {
    if (!this.armed) return;
    const probe = await this.api.verify(this.account.email, this.account.password);
    const body = validate(messageSchema, probe.body);
    if (body.responseCode === 200) {
      expectMessage(probe, 200, 'User exists!');
      expectMessage(await this.api.delete(this.account), 200, 'Account deleted!');
      expectMessage(
        await this.api.verify(this.account.email, this.account.password),
        404,
        'User not found!',
      );
    } else {
      expectMessage(probe, 404, 'User not found!');
    }
    this.armed = false;
  }
}
