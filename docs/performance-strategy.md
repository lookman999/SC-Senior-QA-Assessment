# Performance strategy

## What this project actually measures

`npm run test:perf` makes one warmup and five sequential catalog calls. It checks every response's HTTP status and application contract, records client elapsed time through body parsing, and attaches min/median/p95/max and the raw samples.

With five samples, nearest-rank p95 is simply the maximum. That is a diagnostic observation, not a statistically reliable tail estimate. The measurement includes network/proxy effects and client work; it is not pure server processing time. A generous test timeout prevents a hang and is not an SLA.

No arbitrary latency threshold fails the default suite. An agreed budget can be supplied explicitly with `API_P95_BUDGET_MS`. This still remains a small smoke check. The shared practice website is not a capacity-testing environment.

## For an owned staging environment

| Stage              | Workload                                                                                     | Evidence and decision                                                              |
| ------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Establish baseline | Fixed build, representative data, fixed runner location, dependency configuration documented | Identify network time, service time, cold/warm behavior and existing error rate    |
| Smoke              | Very low traffic to validate the script and business checks                                  | Correct payloads, cleanup, telemetry and stop conditions before raising load       |
| Expected load      | Arrival rate based on production traffic and business mix                                    | Endpoint p50/p95/p99, throughput, application failure rate and resource saturation |
| Spike              | An agreed brief burst then return to normal                                                  | Queue growth, throttling, recovery time and correctness after recovery             |
| Soak               | Sustained representative load, long enough for suspected leaks                               | Memory/connection growth, queue lag, GC, database locks and stable latency         |
| Stress             | Increment toward a pre-approved ceiling                                                      | Sustainable capacity, failure mode and recovery; stop at agreed safety limits      |

For procurement, weight realistic actions: dashboard reads, catalog search, PR creation, approval and PO conversion. Use separate users/tenants and unique transaction data. Correctness under concurrency matters: an approval must not execute twice, budgets must remain consistent, and one tenant must not see another tenant's data.

## Why k6 is provided separately

`performance/catalog-load.js` is an unexecuted staging template. It uses a constant arrival rate so a slower server does not automatically lower the offered workload in the same way a fixed-VU loop can. It has a small VU cap; `dropped_iterations` must be checked because insufficient VUs can prevent the intended load being delivered. One iteration currently makes one request, so its 2 iterations/second target corresponds to 2 catalog requests/second.

The template refuses `automationexercise.com` and requires an explicit authorized staging origin. Its 30-second run and latency thresholds are illustrative script-validation settings, not a production benchmark or claimed acceptance criteria. Even 60 intended requests cannot justify a robust p99 estimate. Agree the workload, sample size and budgets before using them for a release decision.

```bash
ALLOW_LOAD=1 PERF_BASE_URL=https://your-authorized-staging.example k6 run performance/catalog-load.js
```

Replace the example origin with an owned environment that implements this API contract. The k6 binary is an optional separate dependency. This template was not run against the public website.

Check both transport failures and a custom `business_failures` metric: this API style can return HTTP 200 for application failure. A check without a failing threshold does not necessarily fail a k6 run. The template defines thresholds for both error metrics and dropped iterations, with early abort on sustained errors.

## Browser performance

Use controlled browser journeys for user-facing timings and field data for actual user experience. Measure navigation/TTFB and interaction readiness separately. Collect LCP/CLS/INP with a suitable web-vitals implementation and representative interactions; `DOMContentLoaded`, one click duration or a full functional test runtime is not interchangeable with those metrics.

Run in a stable environment with fixed CPU/network profile, viewport, cache state, ad policy and runner capacity. Do not compare a trace-enabled CI run through a proxy with an unthrottled laptop and call the difference a regression. Report a distribution across sufficient samples and compare comparable builds. Correlate regressions with backend traces, DB queries, CPU/memory and queue metrics before assigning a cause.

## Release decision example

Agree a customer-facing objective, such as the time to submit a purchase request, and a traffic target first. Translate it into endpoint and browser budgets. Report whether the agreed scenario met correctness, error-rate and latency requirements at the delivered load, including sample size and confidence limits. Keep hardware, dataset, build, dependencies and test configuration with the result.
