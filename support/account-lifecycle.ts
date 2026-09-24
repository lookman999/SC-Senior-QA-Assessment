import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { AccountClient } from '../api/account-client';
import type { Account } from '../data/account';
import { expectMessage } from './api-assertions';
import { messageSchema, validate } from '../api/contracts';

export class AccountLifecycle {
  private armed = false;
  private readonly recoveryPath: string;

  constructor(
    private readonly api: AccountClient,
    readonly account: Account,
  ) {
    this.recoveryPath = path.resolve('.runtime', `${account.email.split('@')[0]}.json`);
  }
  async arm() {
    await mkdir(path.dirname(this.recoveryPath), { recursive: true, mode: 0o700 });
    // Record before mutation so an interrupted create can still be cleaned locally.
    await writeFile(
      this.recoveryPath,
      JSON.stringify({ email: this.account.email, password: this.account.password }),
      { mode: 0o600 },
    );
    this.armed = true;
  }
  async create() {
    await this.arm();
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
    await unlink(this.recoveryPath);
    this.armed = false;
  }
}
