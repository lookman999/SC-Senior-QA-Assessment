# Q1 — broken form test

The [original snippet](../tests/question-1-broken-automation-script/original-broken-script.md) is kept separately. `https://example.com/form` returned HTTP 404 when checked on 25 September 2026. The runnable test supplies a local sample form for that URL. Its passing result confirms the locator and assertion changes against the sample; it does not prove a real form was submitted.

## Issues found

1. `input[type="text"]` does not identify the name field. An extra text input makes the locator ambiguous or can direct input to the wrong field.
2. `button` does not identify Submit. Another button can make the click ambiguous or target the wrong action.
3. Checking only that `.success-message` is visible can pass for an unrelated message.
4. The test does not establish that the success message was absent before submission. A stale message could satisfy the assertion; this is a possible risk because the real page is unavailable.
5. The hardcoded example URL is a placeholder, so the live form and its actual labels cannot be verified.

## Two fixes made

1. Locate the name textbox and submit button by their exact accessible names.
2. Assert the exact `Form Submitted` message after submission.

The sample form includes another textbox and button to expose the broad-selector problem. Its labels are assumptions for the demonstration; they need checking against a real form when one is supplied. Playwright already waits for actionable elements and retryable assertions, so the fix does not add a fixed delay.

Run with `npm run test:q1`.
