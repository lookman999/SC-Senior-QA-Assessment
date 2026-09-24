# Requirement coverage

Source: supplied five-page assessment, filename dated 20260917. The PDF footer says v20260813; this implementation follows the supplied contents.

| Requirement                                        | Test / answer                                                                         | Principal evidence                                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1: at least four problems, explain risks, fix two | `docs/question-1-review.md`; `tests/question-1-broken-automation-script/form.spec.ts` | Original retained; focused diff; controlled local example clearly labelled                                                                                             |
| TC01: register and delete                          | `question-2-automation-test/account.spec.ts`                                          | Full profile, DOB, both checkboxes, created state, correct logged-in name, UI deletion and continue                                                                    |
| TC02: valid login and delete                       | Same file                                                                             | Fresh account provisioned by API, login form used, correct name, UI deletion                                                                                           |
| TC03: invalid login                                | Same file                                                                             | Unique unregistered credentials, exact rejection message, no logout link, still on login URL                                                                           |
| TC15: register before checkout                     | `question-2-automation-test/checkout.spec.ts`                                         | UI registration, two products, quantity 2/1, cart, delivery and invoice addresses, price calculations, comment, dummy payment, final confirmation, delete and continue |
| API01: products                                    | `question-3-api-automation-test/catalog.spec.ts`                                      | HTTP 200 + body 200, nested schema, non-empty list, unique IDs                                                                                                         |
| API03: brands                                      | Same file                                                                             | HTTP 200 + body 200, schema, non-empty list, unique IDs                                                                                                                |
| API05: search                                      | Same file; three named examples                                                       | Encoded form parameter, HTTP/body status, schema and search relevance for top/tshirt/jean                                                                              |
| API07: valid credentials                           | `question-3-api-automation-test/login.spec.ts`                                        | Owned synthetic account, body 200 and exact message, lifecycle cleanup                                                                                                 |
| API10: invalid credentials                         | Same file                                                                             | Unique unknown account, HTTP 200, body 404 and exact message                                                                                                           |
| Shared step definition design                      | `steps/ui-steps.ts`, `steps/api-steps.ts`                                             | Reusable Given/When/Then methods and native report steps                                                                                                               |
| POM and API client classes                         | `pages/`, `api/`                                                                      | Tests do not carry selectors or HTTP request mechanics                                                                                                                 |

## Supplemental coverage

| Area             | Scope                                                            | What it cannot establish                                                |
| ---------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Framework guards | Business failure under HTTP 200, invalid schema, money precision | Overall application correctness                                         |
| SEC01            | Same response for wrong password and unknown account             | Equal response timing or rate-limit effectiveness                       |
| SEC02            | Missing parameter rejected; no reflected password                | Full input-validation or injection resistance                           |
| SEC03            | Credential verification returns only expected fields             | No data exposure on other endpoints                                     |
| SEC04            | Search parameter required                                        | All search boundary behavior                                            |
| SEC05            | HTTPS login form, POST method, password masking, token presence  | Server-side CSRF enforcement or secure session lifecycle                |
| PERF01           | One warmup plus five sequential request observations             | Capacity, sustained throughput, reliable tail latency or production SLA |

## Requirement ambiguity to disclose

The published TC15 steps request the literal message `Your order has been placed successfully!`. The implementation checks the final `Order Placed!` heading and `Congratulations! Your order has been confirmed!` text on `/payment_done/<id>`. This is an explicit interpretation of the final business outcome; the exact documented transient message still needs reconciliation with the assessor. The selected final confirmation was observed in the successful live TC15 run. It is not silently treated as the same string. See the validation report for the observed result.

The `example.com/form` in Q1 has no supplied page implementation. Q1 is demonstrated using a local intercepted response and cannot claim real backend submission coverage.

The PDF allows online resources. Understand and adapt this work, and follow any additional rules the assessor gives about external or AI assistance. Do not claim a verification you have not personally repeated or cannot explain.
