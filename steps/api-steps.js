import { test, expect } from '@playwright/test';
import { productsSchema, brandsSchema, validate } from '../api/contracts.js';
import { expectMessage } from '../support/api-assertions.js';
export class ApiSteps {
  constructor(catalog, accounts) {
    this.catalog = catalog;
    this.accounts = accounts;
  }
  whenProductsAreRequested() {
    return test.step('When GET productsList is requested', () => this.catalog.products());
  }
  whenBrandsAreRequested() {
    return test.step('When GET brandsList is requested', () => this.catalog.brands());
  }
  whenProductsAreSearched(term) {
    return test.step(`When products are searched for "${term}"`, () => this.catalog.search(term));
  }
  whenLoginIsVerified(account) {
    return test.step('When login credentials are verified by API', () =>
      this.accounts.verify(account.email, account.password));
  }
  thenProductsAreValid(result, term) {
    return test.step('Then transport, application code, schema and product semantics are valid', () => {
      expect(result.httpStatus, 'HTTP status').toBe(200);
      const { products } = validate(productsSchema, result.body);
      expect(products.length, 'Non-empty product results').toBeGreaterThan(0);
      expect(new Set(products.map((p) => p.id)).size, 'Unique product IDs').toBe(products.length);
      if (term) {
        for (const product of products) {
          const searchable = `${product.name} ${product.category.category}`.toLowerCase();
          expect(searchable, `Product ${product.id} matches the requested term`).toContain(
            term.toLowerCase(),
          );
        }
      }
    });
  }
  thenBrandsAreValid(result) {
    return test.step('Then brand schema, non-empty results and unique IDs are valid', () => {
      expect(result.httpStatus).toBe(200);
      const { brands } = validate(brandsSchema, result.body);
      expect(brands.length).toBeGreaterThan(0);
      expect(new Set(brands.map((b) => b.id)).size).toBe(brands.length);
    });
  }
  thenLoginIsAccepted(result) {
    return test.step('Then responseCode is 200 and the user exists', () =>
      expectMessage(result, 200, 'User exists!'));
  }
  thenLoginIsRejected(result) {
    return test.step('Then responseCode is 404 and the user is rejected', () =>
      expectMessage(result, 404, 'User not found!'));
  }
}
