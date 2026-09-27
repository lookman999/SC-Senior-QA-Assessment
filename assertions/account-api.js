import { expect } from '@playwright/test';
import { messageSchema, validate } from '../api/contracts.js';
export function expectMessage(result, code, message) {
  expect(result.httpStatus, 'HTTP transport status').toBe(200);
  const body = validate(messageSchema, result.body);
  // This service reports business failure inside HTTP 200 responses.
  expect(body.responseCode, 'application responseCode').toBe(code);
  expect(body.message, 'application message').toBe(message);
  return body;
}
