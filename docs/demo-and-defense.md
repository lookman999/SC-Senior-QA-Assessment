# Senior QA demonstration and defense guide

Prepared for Luqman. Use this as rehearsal notes; keep the explanation in your own words. The code is useful only if you can trace its execution, change it and explain its limits.

## Your opening: approximately 45 seconds

“I organized the assessment around repeatability, meaningful assertions and useful failure evidence. The UI cases use reusable step definitions and page objects. The API cases use the same step style with Playwright request-context clients. Each account belongs to one test and has a cleanup path. I also separated the required functional scope from a few security checks and performance observations. I’ll show the end-to-end flow, one important API failure case, and how I would investigate a failure.”

Read the validation report before saying what passed. Distinguish the prepared environment from the machine in front of you.

## Demonstration order: 10-12 minutes

| Time           | Show                                          | Point to explain                                                           |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| 0:00-1:00      | README and coverage table                     | Requirements mapped to concrete tests; visible assumptions                 |
| 1:00-2:00      | `checkout.spec.ts`                            | Scenario is readable without selectors or HTTP details                     |
| 2:00-5:00      | `npm run demo`                                | Registration, two products, address/price checks, dummy checkout, deletion |
| During the run | `fixtures/test.ts` and `account-lifecycle.ts` | API setup is a precondition only; data isolation and cleanup on failure    |
| 5:00-7:00      | `npm run test:api -- --grep API10`            | HTTP 200 can still be an application failure; body code and message matter |
| 7:00-8:00      | HTML report and a step definition             | Failure evidence is connected to a business action                         |
| 8:00-9:00      | Q1 diff                                       | Two focused fixes; no invented missing wait or broad rewrite               |
| 9:00-10:00     | Security and performance notes                | Evidence-based findings, measured limitations, next tests on owned staging |
| 10:00-12:00    | Questions                                     | Explain a tradeoff, show the code, acknowledge its boundary                |

Each test invocation replaces the default report. Open the UI report before running the API test if you want to walk through the UI steps, or run both required projects in one command to keep a combined report.

## Preparation on your laptop

1. Install the pinned Node version, run `npm ci --ignore-scripts`, and install Chromium.
2. Run `npm run typecheck`, `npm run format:check`, `npm run test:guards`, and `npm test`.
3. Run `npm run demo` on the actual screen and network you will use. Confirm the headed browser opens and text is readable.
4. Run `npm run cleanup` and check there are no unresolved test accounts.
5. Keep the latest report locally. Retain a previous report in a separate private folder if you need a recorded fallback; label its timestamp when showing it.
6. Open only the relevant files. Avoid exposing personal terminal history, credentials, recovery records or unrelated company material while screen-sharing.
7. Be ready to edit one assertion or add a search term during the discussion. The existing search data table is a good small demonstration.

On Fedora, validate browser dependencies ahead of time. Playwright's officially listed Linux systems are Debian/Ubuntu variants; an installed Chrome channel is an optional local choice, and a supported Ubuntu environment is the predictable fallback. A remote headless pass does not prove your local headed demonstration is ready.

## Explain the execution path without reading every line

For valid UI login:

1. The `registeredAccount` fixture creates a unique synthetic account through `AccountClient`.
2. `AccountClient` uses the built-in per-test API request context. This is independent from the browser session.
3. The scenario opens home, calls `whenUserLogsIn`, and the step delegates to `LoginPage`.
4. `LoginPage` fills unique `data-qa` controls and submits the UI form.
5. The expected user name is checked; the scenario deletes the account through the UI.
6. Fixture teardown confirms those credentials no longer identify an existing account. If the UI test failed earlier, teardown removes the account itself.

For API search:

1. A named search term feeds the same reusable step.
2. `CatalogClient` sends an encoded `form` payload using Playwright's request context.
3. The result includes transport status, parsed JSON and a client-side timing observation.
4. Assertions verify HTTP 200, body code 200, nested runtime schema, non-empty results, unique IDs and search relevance.
5. The report attachment contains status/timing/count information, without dumping response credentials.

## Questions you should be able to answer

### 1. Why TypeScript?

“It catches incorrect fixture usage, client arguments and page method calls before execution. I enabled strict checking and run `tsc` separately because Playwright transpilation does not provide a full type check. TypeScript does not validate JSON from the server, so I use runtime schemas at that boundary.”

### 2. Why use both page objects and steps?

“A page object knows how to interact with one part of the UI. A step represents a reusable business action and makes it visible in the report. The spec describes the scenario. A selector change should normally affect one page object, while a business-flow change affects the steps or scenario.”

Avoid claiming every one-line action needs its own abstraction. The PDF explicitly requires this structure; in a smaller project you could use fewer layers.

### 3. Is this Cucumber?

“No. The brief says step definitions without specifying a runner or Gherkin. I implemented reusable Given/When/Then methods using Playwright's native step reporting. If `.feature` files are expected, I would add that adapter and reuse these page objects and API clients.”

Do not describe a label-only `test.step()` block as equivalent to reusable Gherkin bindings. Your reusable methods are the explicit implementation here.

### 4. Why not register through the UI before every test?

“Registration is exercised in TC01 and TC15. For a login test, registration is a precondition, so the API makes setup shorter and avoids making every login test depend on the registration UI. The valid-login test still performs login through the browser.”

### 5. Why not share a single test user?

“These scenarios delete users and change cart state. Sharing one user couples test order and creates races. One user per test makes selective runs and parallel execution possible. It also makes cleanup ownership clear.”

### 6. Why not use stored authentication state?

“Login and registration are part of the required behavior, so reusing a logged-in state would skip what I need to test. For unrelated read-only scenarios in a larger suite, I would consider worker-scoped accounts and stored state, with the files treated as secrets. For mutating scenarios, I would keep separate accounts or reset state explicitly.”

### 7. Why check `responseCode` if HTTP status is already 200?

“The service's contract encodes business failures inside HTTP 200. API10 passes only when HTTP is 200, `responseCode` is 404 and the message is exactly the documented rejection. The framework guard demonstrates that a body-level failure cannot pass as successful login.”

### 8. Why schemas as well as assertions?

“Schemas verify the response shape and data types at runtime. Semantic assertions check meaning: the list is non-empty, IDs are unique and search results match the search. A perfectly shaped but empty or irrelevant response could still be wrong.”

### 9. Are extra response fields always a breaking change?

“Not necessarily. Product schemas permit additive fields so harmless additions do not create noise. For the credential-verification response, I deliberately inspect the raw keys to detect unintended account data exposure. Parsing first could strip extra fields and hide that issue.”

### 10. Why `form` rather than `data`?

“These endpoints expect form parameters. `form` gives the proper encoding. JSON is a different wire contract; sending it because the response happens to be JSON would be a mistake.”

### 11. Why semantic selectors and `data-qa`?

“Roles and names follow the user's visible controls, and this site supplies specific test hooks for form fields. Both are easier to maintain than positional XPath. I still use a few stable IDs/classes for line items and address blocks where no good accessible hook exists, but those are localized in the page objects.”

### 12. How do you handle waiting?

“Playwright checks actionability before interactions, and locator assertions retry until their condition is true or the timeout expires. I wait for observable application state. A fixed sleep either wastes time or remains too short. Auto-waiting for a clickable button does not itself prove the backend operation succeeded; that is why I assert the result.”

### 13. Why zero retries?

“For this small assessment I want first-attempt failures visible. Retries can be a controlled diagnostic tool in a larger suite, but they should not hide a reliability problem. I would record flaky results separately and investigate them. A mutation must not be retried automatically unless its idempotency is understood.”

### 14. What if creation times out after the server creates the user?

“I arm cleanup before the mutation and keep the generated credentials in a private local recovery record. Teardown checks whether the account exists, deletes it if needed, and verifies absence. A failed cleanup fails the test. A killed runner can still leave data behind, so production needs server-side TTL or a janitor too.”

### 15. Does cleanup hide the original failure?

“No. Playwright retains the test error and reports the teardown error as well. I do not catch a failure and turn the test green. The cleanup message is sanitized and points to the recovery command.”

### 16. Why calculate monetary values in minor units?

“Money should not depend on floating point rounding. I parse amounts into integer minor units, multiply by quantity and sum the line totals. It catches incorrect quantity calculations and inconsistent grand totals.”

### 17. Is using the API as the price oracle sufficient?

“It checks UI/API consistency and I calculate totals independently. It cannot detect a price defect shared by both layers. In a controlled product environment I would create known catalog data and derive expected prices from the pricing rules, including tax, discounts and rounding.”

### 18. Does the order confirmation prove payment succeeded?

“It proves the practice site's user-facing confirmation. This is a dummy checkout. For a real payment flow I would also verify the order and payment records, gateway callback authenticity, idempotency, duplicate clicks and failure/recovery states. I would not infer settlement from a toast.”

### 19. The documented success text differs. Why?

“I recorded that discrepancy explicitly. The implemented check verifies the final order-confirmed state and its exact text. I would confirm whether the assessor treats the published transient wording as a strict acceptance requirement. If so, the mismatch is a finding to resolve, not a reason to loosen the assertion silently.”

The live TC15 run passed with the final heading and confirmation text above. The exact published transient-message requirement remains an explicit acceptance ambiguity.

### 20. What security weakness did you find?

Lead with confirmed evidence: “The catalog response was JSON labelled as HTML, and it disclosed the server component/version header. The HTTP-200-for-errors contract can also mislead monitoring. I have not claimed an authentication bypass or exploitable vulnerability from those observations.”

Then identify a hypothesis clearly: “The documented email-only account-detail API deserves an authorization review using accounts we own. Documentation alone does not confirm that it exposes private profiles anonymously.”

### 21. How would you test authorization properly?

“Use at least two owned users and resources. User A creates a resource; user B attempts the direct API operation. Assert denial and verify the resource did not change. Repeat across roles and tenants. A hidden UI action is not server-side authorization.”

For ADAM, a concrete example is a requester attempting to approve their own PR, or an approver from a different entity accessing a PR by ID.

### 22. How is this security work different from a penetration test?

“These are narrow regression checks with an explicit scope. Password masking and token presence do not prove secure transport or CSRF enforcement. A full assessment needs authorized negative testing, threat modelling, source/configuration review and stronger evidence.”

### 23. Why not use Playwright workers for load testing?

“Browser workers are expensive and a functional suite does not represent a controlled arrival-rate workload. I use Playwright for journeys and small observations, and a load tool such as k6 or JMeter for explicit traffic models, error metrics and resource correlation on an owned environment.”

### 24. What does your p95 mean?

“The included diagnostic has five samples, so its p95 is the maximum. It does not support a capacity or SLA claim. A release decision needs enough samples, representative workload and consistent environment conditions. Average latency alone can hide a slow tail.”

### 25. Why an arrival-rate load model?

“It schedules iterations independently of response completion. With a fixed number of looping users, a slower service can reduce the offered load. Arrival-rate tests help reveal that, but only if there are enough VUs. Dropped iterations show whether we failed to deliver the intended workload.”

### 26. How do you investigate a flaky test?

“Start with the first failed step and evidence. Classify locator ambiguity, missing application readiness, shared data, environment failure or a real product defect. Reproduce the isolated case with fresh data, use a private trace if needed, fix the cause, and rerun the affected coverage. I would not immediately add sleeps or increase every timeout.”

### 27. How would you bring this into Supplycart?

“Keep the separation of scenarios, page objects, clients and data lifecycle, then adapt to ADAM's contracts. Start with high-risk procurement rules: approvals, budgets, totals, PR-to-PO consistency and tenant isolation. Put fast API checks in change validation, a small UI smoke suite on critical changes, and broader compatibility/regression coverage on a controlled schedule. Track useful failures and escaped defects alongside pass rate.”

### 28. What would you improve next?

“First resolve remaining contract ambiguities and complete execution on the actual presentation machine. For an owned product I would add deterministic fixture APIs, authorization matrices, persisted-state checks, representative performance workloads and safer test-data expiry. I would expand the framework only when repeated needs justify it.”

## If something fails during the presentation

1. State the failing step and actual observation calmly.
2. Read the error and inspect the report. Do not blame the site or the framework before evidence supports it.
3. For a connectivity issue, show the recorded run with its timestamp and explain that the live dependency is currently unavailable. Do not call the recorded run a live success.
4. For a selector or product change, show how the page object contains the change. Do not weaken the assertion just to get green.
5. For a requirement discrepancy, explain expected versus actual and ask which is authoritative.
6. Run cleanup if the process was interrupted.

## Final rehearsal exercises

1. Explain `await`, a `Locator`, a fixture and a request context without jargon.
2. Follow TC02 from fixture setup to UI deletion to teardown without looking at these notes.
3. Add a fourth search term and explain how you know its expected result.
4. Temporarily change API10's expected body code to 200, run it, read the failure, then restore it.
5. Describe one security finding, one unverified risk and one positive check without confusing them.
6. Explain why the test count, a green report and a short average runtime do not by themselves prove release quality.

If asked about external assistance, describe it accurately. Be ready to explain and modify every part you submit.
