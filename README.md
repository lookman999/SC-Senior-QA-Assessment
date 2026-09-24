# Senior QA automation assessment

Repository: https://github.com/lookman999/SC-Senior-QA-Assessment

[GitHub Actions assessment checks](https://github.com/lookman999/SC-Senior-QA-Assessment/actions/workflows/assessment.yml) run the required matrix on every push. The first hosted run passed all 12 required executions, TypeScript checks and framework guards; see `docs/validation-report.md` for the exact scope.

A TypeScript Playwright project for the supplied Supplycart assessment. It includes the Q1 debugging review, required UI/API scenarios, reusable step definitions, page objects, API clients, security checks, a performance strategy and interview notes.

**Read `docs/validation-report.md` for what was actually executed, the environment and any remaining limitations.** Defined tests are not automatically verified tests.

## Start locally

Use Node.js 24; `.nvmrc` pins the version used during preparation. Install browsers before the presentation while you have a stable network.

```bash
cd automation-assessment
npm ci --ignore-scripts
npx playwright install chromium
npm run typecheck
npm test
npm run report
```

No personal account, API key or `.env` secret is required. Tests create synthetic accounts on Automation Exercise and remove them. Internet access is needed for Q2/Q3; Q1 uses a labelled controlled local response after the browser is installed.

On supported Ubuntu/Debian systems, use `npx playwright install --with-deps chromium` if OS libraries are missing. Fedora is not in Playwright's official Linux support list. Try the browser install and test it before interview day; a supported Ubuntu environment is the predictable fallback. If Google Chrome is already installed, `PW_CHANNEL=chrome npm run demo` can use it. That changes the browser under test and must be recorded. Do not run Ubuntu `apt` commands on Fedora.

On a network requiring an HTTP proxy, supply `PW_PROXY_SERVER` according to your network configuration. It is not set automatically. The `.env.example` documents shell variables; copying it to `.env` does not automatically load it.

## Commands

| Command                 | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `npm test`              | Required Q1/Q2/Q3 suite: 12 executions, including 3 search examples |
| `npm run test:q1`       | Controlled demonstration of the two Q1 fixes                        |
| `npm run test:ui`       | Required four UI journeys in Chromium                               |
| `npm run test:api`      | Required API cases, with three search terms                         |
| `npm run test:guards`   | Checks that critical assertion helpers reject bad results           |
| `npm run test:security` | Five additional security checks with documented limits              |
| `npm run test:perf`     | One warmup plus five sequential latency observations                |
| `npm run demo`          | Headed TC15 checkout for the presentation                           |
| `npm run demo:inspect`  | Playwright UI mode for browsing test steps                          |
| `npm run report`        | Opens the latest HTML report                                        |
| `npm run cleanup`       | Recovers any synthetic accounts recorded after interrupted runs     |
| `npm run format:check`  | Checks consistent source formatting                                 |
| `npm run check`         | Type check, framework guards and required scenarios                 |

To run one API case: `npm run test:api -- --grep API10`.

To capture a private trace for a failing UI case:

```bash
CAPTURE_TRACE=1 npm run test:ui -- --grep TC15
npm run report
```

Do not run two Playwright processes concurrently in this folder using the same output/report directories. One process may overwrite the other's evidence. Use projects in a single invocation or distinct output paths.

## Structure

| Path                                         | Responsibility                                                                    |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| `tests/question-1-broken-automation-script/` | Original snippet and focused patched demonstration                                |
| `tests/question-2-automation-test/`          | UI cases 1, 2, 3 and 15                                                           |
| `tests/question-3-api-automation-test/`      | API cases 1, 3, 5, 7 and 10                                                       |
| `tests/security/`, `tests/performance/`      | Explicitly selected supplemental checks                                           |
| `pages/`                                     | UI controls, actions and page assertions                                          |
| `steps/`                                     | Reusable Given/When/Then methods and report steps                                 |
| `api/`                                       | Request-context clients and runtime response contracts                            |
| `fixtures/`, `data/`, `support/`             | Test isolation, generated data, cleanup and targeted helpers                      |
| `performance/`                               | k6 staging template, never automatically run                                      |
| `.github/workflows/`                         | CI workflow with pinned actions and cleanup                                       |
| `docs/`                                      | Review, architecture, coverage, evidence, security, performance and defense guide |

## Design choices worth explaining

1. Verify HTTP status **and** JSON `responseCode`. This API uses HTTP 200 for business errors.
2. Keep registration in the UI when it is the scenario; use the API to provision a login precondition.
3. Generate one account per test. No test depends on a prior test having run.
4. Assert address content and independently calculated totals, not only successful clicks.
5. Teardown must report failures. Recovery files are private and excluded from Git.
6. Use native reusable step methods. The brief does not explicitly demand Cucumber; that assumption is documented.
7. Traces are opt-in because they contain credentials/cookies. Public CI does not automatically publish artifacts.
8. Performance observations are labelled as a small sample; no throughput or production SLA claims are made.

## Review before submission

Read these in order:

1. `docs/validation-report.md`
2. `docs/question-1-review.md`
3. `docs/architecture.md`
4. `docs/coverage.md`
5. `docs/demo-and-defense.md`
6. `docs/security-review.md` and `docs/performance-strategy.md`

The known TC15 confirmation-text ambiguity is recorded in coverage and validation notes. Q1 is a demonstration because the brief supplies no actual form implementation.

## GitHub submission

Clone this repository and run the checks above. The repository includes the assessment source, documentation and a GitHub Actions workflow; it deliberately excludes `node_modules`, `.runtime`, `.env`, reports, screenshots and traces. Share the repository link with the assessors yourself.

## Optional compatibility runs

```bash
npx playwright install firefox webkit
npm run test:cross-browser
```

Run on a supported OS and record the result separately. The required Chromium run does not establish Firefox/WebKit compatibility.

## References

- [Automation Exercise UI scenarios](https://automationexercise.com/test_cases)
- [Automation Exercise API contract](https://automationexercise.com/api_list)
- [Playwright API testing](https://playwright.dev/docs/api-testing)
- [Playwright fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Playwright system requirements](https://playwright.dev/docs/intro#system-requirements)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [k6 thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [k6 arrival-rate executor](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/)
