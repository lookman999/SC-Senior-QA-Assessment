# SC - Senior QA automation assessment

Playwright JavaScript tests for the three assessment questions. The required suite covers Q1, UI cases 1/2/3/15, and API cases 1/3/5/7/10.

## Run

Use Node.js 24:

```bash
npm ci
npx playwright install chromium
npm run check
```

- `npm test` runs the required tests.
- `npm run test:q1`, `npm run test:ui`, and `npm run test:api` run one question at a time.
- `npm run test:ui -- --grep TC15` runs checkout only.
- `npm run test:report` runs the suite and builds a fresh Allure report.
- `npm run report` builds an Allure report from existing `allure-results`.
- `npm run report:open` opens the generated report.

Q1 and UI tests open a browser locally and pause 400 ms between browser actions. CI runs headless at normal speed. API tests use HTTP requests, so they do not open a browser. On a machine without a display, use `CI=1 npm test`. If Playwright's Chromium is unavailable but Chrome is installed, use `PW_CHANNEL=chrome npm test`.

## Files

- `tests/question-1-broken-automation-script/`: original snippet and a controlled form example. [Q1 notes](docs/question-1-review.md) cover the issues and fixes.
- `tests/question-2-automation-test/`: UI account and checkout cases.
- `tests/question-3-api-automation-test/`: API catalog and login cases.
- `steps/` and `pages/`: reusable steps and page objects for UI tests.
- `steps/` and `api/`: reusable steps and request clients for API tests.
- `fixtures/`, `data/`, and `support/`: fresh account data, cleanup, and small helpers.

## Test notes

- Q1's `https://example.com/form` is a placeholder and returned HTTP 404 when checked on 25 September 2026. The Q1 test supplies local HTML for that URL; its locators and assertion run against the local form, not a live application.
- UI and API cases run against Automation Exercise. Each account-creating test uses a fresh synthetic user and checks or deletes it during teardown. A forcibly stopped run can leave an account behind.
- The API can return HTTP 200 for a business error, so API tests also check the JSON `responseCode`.
- TC15 checks cart contents, addresses, totals, and the final order confirmation. The published wording `Your order has been placed successfully!` differs from the final page text checked by the test. Comparing UI and API prices also cannot catch a defect shared by both.
- UI tests block known third-party ad and survey hosts that can cover checkout controls. First-party application requests still run normally.

## Reporting and CI

Allure results go to `allure-results/` and generated reports to `allure-report/`; both are ignored by Git. Results from separate `npm test` commands can accumulate in `allure-results`, so use `npm run test:report` for a report of one fresh full run. Failed tests may include screenshots; review a report before sharing it.

`.github/workflows/assessment.yml` checks pushes to `main`, pull requests, and manual dispatches. It does not schedule runs or deploy the project.

## Further test scope

- Security: with two owned users, check authorization, session expiry, and sensitive API fields on an owned test environment.
- Performance: agree on representative traffic and budgets, then measure latency, errors, and server resources over enough samples. The public practice site is not a load target.
