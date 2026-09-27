import { expect } from '@playwright/test';
import { productsSchema, brandsSchema, validate } from '../api/contracts.js';

export function expectProducts(result, term) {
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
}

export function expectBrands(result) {
  expect(result.httpStatus).toBe(200);
  const { brands } = validate(brandsSchema, result.body);
  expect(brands.length).toBeGreaterThan(0);
  expect(new Set(brands.map((b) => b.id)).size).toBe(brands.length);
}
