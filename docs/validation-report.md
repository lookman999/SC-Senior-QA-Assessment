# Validation report

Updated: 24 September 2026 UTC. The complete required matrix passed in a single fresh invocation of `npm run check` (12/12, zero skipped, zero flaky, zero unexpected). Historical targeted runs are also retained in `verification-results.json`.

## Required assessment coverage

| Group                                                  | Executions | Result | Evidence                                                      |
| ------------------------------------------------------ | ---------- | ------ | ------------------------------------------------------------- |
| Q1 controlled form demonstration                       | 1          | Passed | Playwright browser execution; 0.912 seconds test duration     |
| UI TC01, TC02, TC03, TC15                              | 4          | Passed | Live Automation Exercise journeys, including account deletion |
| API01, API03, API05 with top/tshirt/jean, API07, API10 | 7          | Passed | Live API execution in the same invocation                     |
| Required total                                         | 12         | Passed | One run, 269.76 seconds including setup and run overhead      |

The combined successful run started at 16:53:44 UTC. The earlier targeted API run started at 15:58:38 UTC; the earlier successful UI/security-UI run started at 16:26:20 UTC. Exact per-test durations are retained in `verification-results.json`.

The successful TC15 run observed the final `Order Placed!` heading and `Congratulations! Your order has been confirmed!` text on the payment confirmation URL. The published scenario requests a different literal success message. This is a documented acceptance ambiguity; the final outcome check passed, but the exact published transient string is not claimed as verified.

## Supplemental validation

| Check                                             | Result                     | Qualification                                                                                                                               |
| ------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework assertion guards                        | 3 passed                   | Business-code rejection, runtime contract rejection, money parsing                                                                          |
| SEC01-SEC04 security API checks                   | 4 passed                   | Individual pass results recorded in terminal; combined security/performance invocation was interrupted before its final report was retained |
| SEC05 login form configuration                    | Passed                     | Part of the retained successful UI report                                                                                                   |
| Strict TypeScript check                           | Passed                     | Fresh `tsc --noEmit` as part of `npm run check`                                                                                             |
| Source formatting                                 | Passed                     | Fresh `npm run format:check`                                                                                                                |
| JavaScript syntax                                 | Passed                     | k6 template and recovery script parsed by Node; this does not execute k6                                                                    |
| Dependency advisory audit                         | 0 reported vulnerabilities | `npm audit` at preparation time; not proof of an entirely secure dependency tree                                                            |
| Local recovery command                            | Passed                     | Retained synthetic-account recovery record was processed; final recovery record count was zero                                              |
| PERF01 small latency observation                  | Failed / incomplete        | Non-JSON HTTP 403 during sampling; no valid completed benchmark                                                                             |
| Firefox, WebKit, GitHub Actions, k6 load template | Not executed               | Configured or supplied only                                                                                                                 |
| Local headed demonstration on Luqman's laptop     | Not executed here          | Must be rehearsed on the presentation machine                                                                                               |

## Environment and setup issues

Runtime: Linux container, Node 24.19.0, Playwright 1.63.0, Chromium 153.0.8010.0 in headless mode. One worker; retries disabled; traces disabled; ad filtering disabled.

The standard Playwright browser CDN returned a “Site Unavailable” HTML response instead of a browser archive. The successful browser run used a separately packaged Chromium 153 binary from `@sparticuz/chromium` 153.0.0, selected through the optional `PW_EXECUTABLE_PATH` setting. That package is not a dependency of the submission. The README uses the normal Playwright browser installer for the user's machine. The exact Playwright-bundled browser and a local headed run remain to be checked there.

Direct API requests initially failed name resolution. The successful runs used this execution environment's configured HTTPS proxy. Browser navigation initially failed with `ERR_CERT_AUTHORITY_INVALID`; the runtime's already system-trusted CA was added to the browser's trust database. Certificate verification remained enabled throughout; no `ignoreHTTPSErrors` override was used. This environment setup is not embedded in the delivered project.

An initial fresh full-matrix attempt stopped at browser certificate trust, while its Q1 and API cases passed. The browser's trust store was given the environment's already system-trusted `openai.com` CA after identifying the certificate issuer; HTTPS verification stayed enabled. TC01 was rerun successfully, followed by a fresh full-matrix run with all 12 required cases passing. This was a manual rerun after a specific environment correction, not a configured test retry.

## Performance limitation

The small sampling attempt failed when the catalog endpoint returned a non-JSON HTTP 403. A single diagnostic follow-up returned HTTP 200 with valid product JSON. The cause of the transient response is not established. It must not be presented as a confirmed application security block, a proven performance defect, or evidence of a reliable latency SLA.

The performance test was subsequently improved to preserve partial sample counts/timings in a `finally` attachment and to withhold percentile values when collection is incomplete. That final diagnostic change was type-checked and syntax-checked; the live sampling was not repeated after that change. No completed latency figures are claimed.

## Before the presentation

1. Install the pinned dependencies and the browser on the actual laptop.
2. Run `npm run check` and retain that machine's report.
3. Run `npm run demo` and rehearse the headed checkout.
4. Confirm the interpretation of “Step Definitions” and the TC15 wording if the assessor expects exact Gherkin bindings or an exact transient toast.
5. Show observed results and remaining limitations accurately. A configured test or a previous report is not a current live pass.
