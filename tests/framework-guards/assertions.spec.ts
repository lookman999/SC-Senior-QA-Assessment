import { test, expect } from '@playwright/test';
import { expectMessage } from '../../support/api-assertions';
import { productsSchema, validate } from '../../api/contracts';
import { rupeesToMinor } from '../../support/money';

test('HTTP 200 must not hide a business failure', () => {
  const result = {
    httpStatus: 200,
    body: { responseCode: 404, message: 'User not found!' },
    elapsedMs: 1,
    contentType: 'application/json',
  };
  expect(() => expectMessage(result, 200, 'User exists!')).toThrow();
});

test('malformed product data fails without echoing sensitive values', () => {
  expect(() => validate(productsSchema, { responseCode: 200, products: 'secret-value' })).toThrow(
    /products: invalid_type/,
  );
  try {
    validate(productsSchema, { responseCode: 200, products: 'secret-value' });
  } catch (error) {
    expect(String(error)).not.toContain('secret-value');
  }
});

test('money parsing preserves decimals and rejects malformed totals', () => {
  expect(rupeesToMinor('Rs. 500.05') * 3).toBe(150015);
  expect(() => rupeesToMinor('Rs. NaN')).toThrow();
  expect(() => rupeesToMinor('Rs. 10.001')).toThrow();
});
