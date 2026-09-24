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

[GitHub Actions push run #1](https://github.com/lookman999/SC-Senior-QA-Assessment/actions/runs/36033670763) on commit `a52a577f5e17efed702ae66576d9a6711c50fbfd` also succeeded on Ubuntu 24.04. The job installed Playwright Chromium, passed TypeScript and all three framework guards, reported **12 passed (25.2s)** for `npm test`, and completed the final account cleanup step. This is hosted evidence for that commit; the headed presentation run on Luqman's laptop remains separate.

The successful TC15 run observed the final `Order Placed!` heading and `Congratulations! Your order has been confirmed!` text on the payment confirmation URL. The published scenario requests a different literal success message. This is a documented acceptance ambiguity; the final outcome check passed, but the exact published transient string is not claimed as verified.

## Supplemental validation

| Check                                         | Result                     | Qualification                                                                                                       |
| --------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Framework assertion guards                    | 3 passed                   | Business-code rejection, runtime contract rejection, money parsing                                                  |
| GitHub Actions push run #1                    | Passed                     | Ubuntu 24.04, official Playwright Chromium, 12 required tests, typecheck, guards and cleanup                        |
| SEC01-SEC04 security API checks               | 4 passed across runs       | SEC02-SEC04 passed in a fresh combined security run; SEC01 timed out there, then passed on a focused manual recheck |
| SEC05 login form configuration                | Passed                     | Passed in the fresh combined security run and an earlier UI run                                                     |
| Strict TypeScript check                       | Passed                     | Fresh `tsc --noEmit` as part of `npm run check`                                                                     |
| Source formatting                             | Passed                     | Fresh `npm run format:check`                                                                                        |
| JavaScript syntax                             | Passed                     | k6 template and recovery script parsed by Node; this does not execute k6                                            |
| Dependency advisory audit                     | 0 reported vulnerabilities | `npm audit` at preparation time; not proof of an entirely secure dependency tree                                    |
| Local recovery command                        | Passed                     | Retained synthetic-account recovery record was processed; final recovery record count was zero                      |
| PERF01 small latency observation              | Failed / incomplete        | Non-JSON HTTP 403 during sampling; no valid completed benchmark                                                     |
| Firefox, WebKit, k6 load template             | Not executed               | Configured or supplied only                                                                                         |
| Local headed demonstration on Luqman's laptop | Not executed here          | Must be rehearsed on the presentation machine                                                                       |

The optional five-check security invocation finished **4 passed, 1 failed**. SEC01's first verification request timed out after 30 seconds; a focused SEC01 rerun passed **1/1** in 57.6 seconds including setup and cleanup. This establishes passing executions for all five checks across runs, but it does not turn the combined security invocation into a clean pass. No automatic retries were configured. No synthetic-account recovery records remained afterward.

## Environment and setup issues

Runtime: Linux container, Node 24.19.0, Playwright 1.63.0, Chromium 153.0.8010.0 in headless mode. One worker; retries disabled; traces disabled; ad filtering disabled.

The standard Playwright browser CDN returned a “Site Unavailable” HTML response in this preparation container. Its successful browser run used a separately packaged Chromium 153 binary from `@sparticuz/chromium` 153.0.0, selected through the optional `PW_EXECUTABLE_PATH` setting. That package is not a dependency of the submission. GitHub Actions successfully installed and ran Playwright's own Chromium on Ubuntu. The README uses the normal installer for the user's machine; a local headed run there remains to be checked.

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
