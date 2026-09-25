import { test } from '../../fixtures/test.js';
test('API01 - Get All Products List', async ({ apiSteps }) => {
  const result = await apiSteps.whenProductsAreRequested();
  await apiSteps.thenProductsAreValid(result);
});
test('API03 - Get All Brands List', async ({ apiSteps }) => {
  const result = await apiSteps.whenBrandsAreRequested();
  await apiSteps.thenBrandsAreValid(result);
});
for (const term of ['top', 'tshirt', 'jean']) {
  test(`API05 - Search Product: ${term}`, async ({ apiSteps }) => {
    const result = await apiSteps.whenProductsAreSearched(term);
    await apiSteps.thenProductsAreValid(result, term);
  });
}
