import { test, expect } from '@playwright/test';
import type { CatalogClient } from '../api/catalog-client';
import type { AccountClient } from '../api/account-client';
import type { ApiResult } from '../api/base-client';
import { productsSchema, brandsSchema, validate } from '../api/contracts';
import type { Account } from '../data/account';
import { expectMessage } from '../support/api-assertions';

export class ApiSteps {
  constructor(
    private readonly catalog: CatalogClient,
    private readonly accounts: AccountClient,
  ) {}
  whenProductsAreRequested() {
    return test.step('When GET productsList is requested', () => this.catalog.products());
  }
  whenBrandsAreRequested() {
    return test.step('When GET brandsList is requested', () => this.catalog.brands());
  }
  whenProductsAreSearched(term: string) {
    return test.step(`When products are searched for "${term}"`, () => this.catalog.search(term));
  }
  whenLoginIsVerified(account: Pick<Account, 'email' | 'password'>) {
    return test.step('When login credentials are verified by API', () =>
      this.accounts.verify(account.email, account.password));
  }
  thenProductsAreValid(result: ApiResult, term?: string) {
    return test.step('Then transport, application code, schema and product semantics are valid', async () => {
      expect(result.httpStatus, 'HTTP status').toBe(200);
      const { products } = validate(productsSchema, result.body);
      expect(products.length, 'Non-empty product results').toBeGreaterThan(0);
      expect(new Set(products.map((p) => p.id)).size, 'Unique product IDs').toBe(products.length);
      if (term) {
        for (const product of products) {
          // Search is evaluated against the product's searchable name/category fields.
          const searchable = `${product.name} ${product.category.category}`.toLowerCase();
          expect(searchable, `Product ${product.id} matches the requested term`).toContain(
            term.toLowerCase(),
          );
        }
      }
      await this.attachSummary(result, products.length);
    });
  }
  thenBrandsAreValid(result: ApiResult) {
    return test.step('Then brand schema, non-empty results and unique IDs are valid', async () => {
      expect(result.httpStatus).toBe(200);
      const { brands } = validate(brandsSchema, result.body);
      expect(brands.length).toBeGreaterThan(0);
      expect(new Set(brands.map((b) => b.id)).size).toBe(brands.length);
      await this.attachSummary(result, brands.length);
    });
  }
  thenLoginIsAccepted(result: ApiResult) {
    return test.step('Then responseCode is 200 and the user exists', async () => {
      expectMessage(result, 200, 'User exists!');
      await this.attachSummary(result);
    });
  }
  thenLoginIsRejected(result: ApiResult) {
    return test.step('Then responseCode is 404 and the user is rejected', async () => {
      expectMessage(result, 404, 'User not found!');
      await this.attachSummary(result);
    });
  }
  private async attachSummary(result: ApiResult, count?: number) {
    await test.info().attach('api-summary', {
      body: JSON.stringify({
        httpStatus: result.httpStatus,
        elapsedMs: result.elapsedMs,
        contentType: result.contentType,
        count,
      }),
      contentType: 'application/json',
    });
  }
}
