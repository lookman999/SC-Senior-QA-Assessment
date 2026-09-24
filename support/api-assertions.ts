import { expect } from '@playwright/test';
import type { ApiResult } from '../api/base-client';
import { messageSchema, validate } from '../api/contracts';

export function expectMessage(result: ApiResult, code: number, message: string) {
  expect(result.httpStatus, 'HTTP transport status').toBe(200);
  const body = validate(messageSchema, result.body);
  // This service reports business failure inside HTTP 200 responses.
  expect(body.responseCode, 'application responseCode').toBe(code);
  expect(body.message, 'application message').toBe(message);
  return body;
}
