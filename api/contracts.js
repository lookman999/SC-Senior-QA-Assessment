import { z } from 'zod';
const positiveId = z.number().int().positive();
export const productSchema = z.object({
  id: positiveId,
  name: z.string().min(1),
  price: z.string().regex(/^Rs\.\s*\d+(?:\.\d{1,2})?$/),
  brand: z.string().min(1),
  category: z.object({
    usertype: z.object({ usertype: z.string().min(1) }),
    category: z.string().min(1),
  }),
});
export const productsSchema = z.object({
  responseCode: z.literal(200),
  products: z.array(productSchema),
});
export const brandsSchema = z.object({
  responseCode: z.literal(200),
  brands: z.array(z.object({ id: positiveId, brand: z.string().min(1) })),
});
export const messageSchema = z.object({
  responseCode: z.number().int(),
  message: z.string().min(1),
});
export function validate(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    // Report paths and rule failures without dumping credentials or response values.
    const paths = result.error.issues.map(
      (issue) => `${issue.path.join('.') || '<root>'}: ${issue.code}`,
    );
    throw new Error(`Response contract failed: ${paths.join('; ')}`);
  }
  return result.data;
}
