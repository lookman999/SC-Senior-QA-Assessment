import { test } from '@playwright/test';
import { expectProducts, expectBrands } from '../../../assertions/catalog-api.js';

export class CatalogApiSteps {
  constructor(catalog) {
    this.catalog = catalog;
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
  thenProductsAreValid(result, term) {
    return test.step('Then transport, application code, schema and product semantics are valid', () =>
      expectProducts(result, term));
  }
  thenBrandsAreValid(result) {
    return test.step('Then brand schema, non-empty results and unique IDs are valid', () =>
      expectBrands(result));
  }
}
