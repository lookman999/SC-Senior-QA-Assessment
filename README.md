# SC - Senior QA Automation Assessment

Playwright JavaScript automation assessment covering:

- **Q1:** Broken automation script review and correction.
- **Q2:** UI automation for Test Cases 1, 2, 3, and 15.
- **Q3:** API automation for API Tests 1, 3, 5, 7, and 10.

## Setup

```bash
npm ci
npx playwright install chromium
```

## Commands

```bash
npm test
```

Available commands:

- `npm test` - run all UI and API tests.
- `npm run test:ui` - run UI tests only.
- `npm run test:api` - run API tests only.
- `npm run check` - check code formatting.
- `npm run format` - fix code formatting.
- `npm run report` - run the full suite and open the Allure report.
- `npm run demo` - run the full suite in presentation mode with 1000 ms browser action delay and open the Allure report.

UI tests run with a visible browser locally and headlessly in CI. API tests use Playwright's HTTP request context without launching a browser.

If Playwright Chromium is unavailable but Google Chrome is installed:

```bash
PW_CHANNEL=chrome npm test
```

## Project Structure

- `tests/question-1-broken-automation-script/` - original Q1 script.
- `tests/question-2-automation-test/` - UI test scenarios.
- `tests/question-3-api-automation-test/` - API test scenarios.
- `docs/question-1-review.md` - Q1 findings and corrected example.
- `pages/` - UI locators and page-specific interactions.
- `steps/UI/` - reusable UI business actions.
- `steps/API/` - reusable API business actions.
- `api/` - API clients and response contracts.
- `assertions/` - reusable UI and API validations.
- `fixtures/` - test setup, dependencies, and cleanup.
- `data/` - synthetic test data.
- `config/` - environment configuration.
- `utils/` - generic helper functions.

## Test Design Notes

- Q1 is a code-review exercise and is not part of the runnable Playwright suite.
- UI scenarios use fresh synthetic account data to reduce dependency between test runs.
- Created accounts are cleaned up during teardown where applicable.
- TC15 validates cart contents, checkout information, order total, payment flow, and final order confirmation.
- Known third-party advertisement and survey requests are blocked during UI automation to reduce interference with application controls.
- API tests validate both the HTTP response and the application's JSON `responseCode`, because Automation Exercise can return HTTP 200 for business-level errors.
- API response contracts are validated for expected structure and data types.

## CI

GitHub Actions runs on:

- Pushes to `main`
- Pull requests
- Manual workflow dispatches

The workflow checks formatting, runs the Q2/Q3 suite headlessly, and always attempts to generate and upload test evidence. Test results and Allure artifacts are retained for 7 days.
