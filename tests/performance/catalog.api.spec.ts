import { test, expect } from '../../fixtures/test';
import { productsSchema, validate } from '../../api/contracts';

test(
  'PERF01 - five sequential catalog latency samples',
  { tag: '@performance' },
  async ({ catalog }, info) => {
    const samples: number[] = [];
    let warmupCompleted = false;
    const budget = process.env.API_P95_BUDGET_MS;
    if (budget)
      expect(Number.isFinite(Number(budget)) && Number(budget) > 0, 'Positive latency budget').toBe(
        true,
      );
    try {
      const warmup = await catalog.products();
      expect(warmup.httpStatus).toBe(200);
      validate(productsSchema, warmup.body);
      warmupCompleted = true;
      for (let i = 0; i < 5; i++) {
        const result = await catalog.products();
        expect(result.httpStatus).toBe(200);
        validate(productsSchema, result.body);
        samples.push(result.elapsedMs);
      }
      // A configured budget is explicit; five samples still cannot establish an SLA.
      if (budget) expect(Math.max(...samples)).toBeLessThanOrEqual(Number(budget));
    } finally {
      // Preserve partial evidence on failure without presenting it as a completed benchmark.
      const sorted = [...samples].sort((a, b) => a - b);
      const complete = warmupCompleted && samples.length === 5;
      await info.attach('latency-observation', {
        body: JSON.stringify(
          {
            completed: complete,
            successfulSampleCount: samples.length,
            samplesMs: samples,
            minMs: sorted[0] ?? null,
            medianMs: complete ? sorted[2] : null,
            p95Ms: complete ? sorted[4] : null,
            maxMs: sorted.at(-1) ?? null,
            concurrency: 1,
            warmupCompleted,
            warmupExcluded: true,
            scope:
              'Client elapsed time through body parsing. Five samples are diagnostic only; p95 equals the maximum.',
            budgetMs: budget ? Number(budget) : null,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });
    }
  },
);
