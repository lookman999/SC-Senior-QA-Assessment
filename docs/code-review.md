# Review of the submitted automation code

## Correctness checks

| Concern                                                 | Review decision                                                               | Evidence / limit                                                    |
| ------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| HTTP success hides application failure                  | Assert both layers; negative tests have distinct expected codes               | API10 and framework guard                                           |
| TypeScript type casts mistaken for validation           | Runtime Zod contracts validate unknown JSON                                   | Malformed-contract guard                                            |
| Cleanup skipped after partial setup                     | Arm recovery before create; fixture `finally` owns cleanup                    | Live account create/verify/delete plus recovery-command exercise    |
| Browser silently pre-authenticated by API setup         | Use standalone built-in `request` fixture for provisioning                    | Browser login remains a required UI action                          |
| Credentials shared across tests                         | Unique generated account per mutation scenario                                | UUID factory and test-scoped fixture                                |
| Duplicate product rows or bad totals                    | Exact row count, unique product IDs, exact quantities, unit/line/grand totals | Cart and checkout assertions; integer money guard                   |
| UI navigation mistaken for completed business operation | Assert created/deleted/logged-in/confirmed state                              | Page objects and step definitions                                   |
| Incomplete performance run shown as success             | Fail on invalid response and attach partial observations                      | `completed` and sample count in attachment; no p95 for partial data |
| Unexpected response values leaked in schema errors      | Report schema paths and rule codes only                                       | Guard checks that a sample sensitive value is absent                |

## Maintainability checks

1. Tests do not import selectors or construct HTTP calls directly for required scenarios.
2. Steps use typed parameters and return values instead of a global mutable scenario object.
3. Endpoint wrappers remain small. There is no generic framework that hides application behavior behind string-driven commands.
4. A page object holds a `Page` reference and does not create its own browser or context.
5. Comments explain short, important reasons: business codes, money precision, cleanup timing, traces and mock scope.
6. Formatting and strict type checking are repeatable package scripts.
7. Package versions and the lockfile are committed. Browser/runtime differences are recorded, not hidden.
8. CI is provided as a template; no GitHub execution is claimed until the repository is actually pushed and the workflow runs.

## Remaining limitations to discuss

- Q1 selectors are assumptions because the real DOM is not supplied. The local harness proves the targeted fixes, not backend submission.
- The TC15 published message differs from the final confirmation text selected by the test. This is a visible requirement interpretation, with live validation tracked separately.
- Runtime schema checks allow additive product fields. Stronger field allowlists are used only where extra data is itself a security concern.
- Comparing UI and API prices can miss a shared backend defect; controlled fixtures are needed for an independent pricing oracle.
- The public API has no documented order-query endpoint suitable for verifying persisted order ownership or real payment settlement.
- There is no automatic retry or assertion fallback to make a failed test green. Public-service and network instability can therefore produce real failed runs that require triage.
- Trace opt-in, a `.gitignore` and sanitized custom attachments reduce exposure but do not guarantee that all browser/runner output is free of sensitive data.
- The suite has no source-level evidence for backend security claims. Security checks cover only their named behavior.
- Cross-browser projects, CI and the staging load template require their own execution evidence.

The validation report is the authoritative account of run results. Review notes describe design intent, not a blanket claim that every scenario has passed.
