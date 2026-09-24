# Question 1 - Review of the existing test

The original is retained in `tests/question-1-broken-automation-script/original.txt`.
The task asks for at least four problems and two fixes. The patched test preserves its visit, fill, click and assertion flow.

## Findings

| Finding                                               | What the original actually does                                                   | Why it is risky                                                                                                                                                          | Recommendation                                                                                           |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1. Broad name selector                                | Selects every `input[type="text"]`.                                               | A second text field causes a strict-mode error. A page with only a different text field can accept the wrong input. Playwright does not silently choose the first match. | Locate the textbox by its unique accessible name or a verified test ID.                                  |
| 2. Broad submit selector                              | Selects every `button`.                                                           | Search, cookie-consent and cancel buttons can make the locator ambiguous or target the wrong action when markup changes.                                                 | Identify the submit action by role and exact name; scope to its form if needed.                          |
| 3. Incomplete success assertion                       | Checks only that `.success-message` is visible.                                   | A different message, such as a draft-save confirmation, can pass despite the required submission outcome being absent.                                                   | Assert the exact required message as well as visibility.                                                 |
| 4. No assurance the result belongs to this submission | Does not establish the initial toast state or correlate a result with the action. | If the application restores a previous toast, the assertion can pass for stale UI state. This is a conditional risk, not a proven bug in the unknown application.        | Verify the result is absent initially, then assert the new outcome or a known response/persisted record. |
| 5. Placeholder destination and environment coupling   | Uses a hardcoded `example.com/form` URL.                                          | The supplied URL is not an identified application form. It also prevents switching staging environments centrally.                                                       | Obtain the real page contract, set `baseURL`, and use a relative route.                                  |
| 6. Setup is not shown                                 | The snippet omits imports and configuration.                                      | As a standalone file it needs `test` and `expect` imports; they may already exist in the actual project.                                                                 | Inspect the file before alleging missing imports as a definite defect.                                   |

## Exactly two categories fixed

1. **Control identification:** replace both broad selectors with semantic locators.
2. **Business assertion:** require the exact `Form Submitted` text.

```diff
- await page.locator('input[type="text"]').fill('John');
- await page.locator('button').click();
+ await page.getByRole('textbox', { name: 'Name', exact: true }).fill('John');
+ await page.getByRole('button', { name: 'Submit form', exact: true }).click();

  const successMessage = page.locator('.success-message');
  await expect(successMessage).toBeVisible();
+ await expect(successMessage).toHaveText('Form Submitted');
```

The labels above are explicit assumptions because no application DOM was supplied for Q1. They must be checked against the real form. The controlled local demonstration includes an extra search field and button to make the selector ambiguity concrete. `page.route()` fulfils only this placeholder URL; it does not mock any Q2 or Q3 application response.

## What I would say in the interview

“I made two focused changes to the existing flow. The selectors now identify the user's intended controls, and the assertion verifies the actual required outcome. The initial code already awaits its actions, and Playwright already auto-waits for actionability, so I did not invent a missing-wait defect or add a sleep. The remaining risks are documented because the brief explicitly says I do not need to fix everything.”

The repeated toaster step in the PDF appears to be a duplicated requirement. I interpret it as one success message unless the assessor specifies two separate events.

Run: `npm run test:q1`.
