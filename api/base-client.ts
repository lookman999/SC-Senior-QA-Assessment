import type { APIRequestContext } from '@playwright/test';
import { performance } from 'node:perf_hooks';

export interface ApiResult {
  httpStatus: number;
  body: unknown;
  elapsedMs: number;
  contentType: string;
}

export class BaseClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async send(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    form?: Record<string, string>,
  ): Promise<ApiResult> {
    const started = performance.now();
    const response = await this.request.fetch(path, {
      method,
      form,
      timeout: 30_000,
      // Mutations are not retried; redirects must not forward credentials elsewhere.
      maxRetries: 0,
      maxRedirects: 0,
    });
    try {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        throw new Error(`${method} ${path}: expected JSON; received HTTP ${response.status()}`);
      }
      return {
        httpStatus: response.status(),
        body,
        elapsedMs: Math.round((performance.now() - started) * 100) / 100,
        contentType: response.headers()['content-type'] ?? '',
      };
    } finally {
      await response.dispose();
    }
  }
}
