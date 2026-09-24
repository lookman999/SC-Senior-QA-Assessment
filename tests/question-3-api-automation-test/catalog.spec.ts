import { test } from '../../fixtures/test';

test('API01 - Get All Products List', { tag: ['@required', '@api'] }, async ({ apiSteps }) => {
  const result = await apiSteps.whenProductsAreRequested();
  await apiSteps.thenProductsAreValid(result);
});

test('API03 - Get All Brands List', { tag: ['@required', '@api'] }, async ({ apiSteps }) => {
  const result = await apiSteps.whenBrandsAreRequested();
  await apiSteps.thenBrandsAreValid(result);
});

for (const term of ['top', 'tshirt', 'jean']) {
  test(
    `API05 - Search Product: ${term}`,
    { tag: ['@required', '@api', '@data-driven'] },
    async ({ apiSteps }) => {
      const result = await apiSteps.whenProductsAreSearched(term);
      await apiSteps.thenProductsAreValid(result, term);
    },
  );
}
