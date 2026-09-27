import { test } from '../../fixtures/test.js';
test('API01 - Get All Products List', async ({ apiSteps }) => {
  const result = await apiSteps.catalog.whenProductsAreRequested();
  await apiSteps.catalog.thenProductsAreValid(result);
});
test('API03 - Get All Brands List', async ({ apiSteps }) => {
  const result = await apiSteps.catalog.whenBrandsAreRequested();
  await apiSteps.catalog.thenBrandsAreValid(result);
});
for (const term of ['top', 'tshirt', 'jean']) {
  test(`API05 - Search Product: ${term}`, async ({ apiSteps }) => {
    const result = await apiSteps.catalog.whenProductsAreSearched(term);
    await apiSteps.catalog.thenProductsAreValid(result, term);
  });
}
