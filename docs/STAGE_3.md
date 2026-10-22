# Stage 3 — connected evidence and follow-through

Local implementation only. No GitHub push, deployment, cloud database writes or model calls. Await approval before Stage 4.

## Evidence rules

Authored associations connect successful/reversed payments to closed accounts and beneficiary detail mismatches; successful disputes to broad evidence guidelines; timed-out cards to late OTPs; flagged inbound payments to suspected F&F business receipts. These are explicit demo associations, not causal inference. Metric definitions, raw counts and existing source dates remain unchanged.

Only accepted findings with an exact quote matching the original source offsets appear as supporting evidence. Suggestions, dismissed findings, invalid quotations and other partners are excluded. Older modified workspaces without the revised content marker receive no automatic metric associations: their issue IDs can mean different things. Start a fresh browser session to inspect the current synthetic sample without deleting saved work.

The selected metric/month/partner travels through metric context links to Partners, Feedback, issue evidence and opportunities. Explicit original-source links remain inspectable even if a finding is later dismissed. Partner filters scope evidence; decisions and actions apply to the entire opportunity. September performance and October sample feedback are labelled as different reporting periods, not a same-period causal measurement. No composite or automatic priority is introduced.

## Scenario 1: cross-border payment reliability

1. Open http://127.0.0.1:3000/?metric=payment-success&period=2026-09 in a fresh session. Confirm **99.70%, +1.50 pp** and the raw counts. Below the trend, find **Performance and source context**.
2. Use **Inspect supporting sources (9)**. Feedback shows accepted sources for closed beneficiary accounts and account-detail mismatches. Open a source to compare original text with its highlighted finding; verify High severity.
3. Use **Compare partners**, open Moss Bank and inspect its performance context. Open the closed-beneficiary issue. Its evidence should be scoped to Moss: one unique partner and one accepted source. **View original & review** opens that exact source.
4. Open **Review opportunity: Help customers confirm beneficiary accounts are open**. Record a decision with a reason, owner and next review date. Record the human priority rationale; it is not inferred from the rate.
5. In **Actions**, assign a concrete next step, owner and due date. Reload and confirm it persists, then mark it complete. In **Partner follow-up**, save a draft. It is not sent; recording external communication requires a separate explicit confirmation.
6. Inspect the mismatch opportunity separately. Reversal and successful-payment cohorts differ; the two rates are not complements and cannot be added as a complete failure taxonomy.

## Scenario 2: card dispute management

1. Open http://127.0.0.1:3000/?metric=dispute-success&period=2026-09. Confirm **43.52%, +1.87 pp** and inspect the definition: final won/lost outcomes, not evidence submissions.
2. Open **Inspect supporting sources (4)**. Read the original fictional comments about broad guidance and weak evidence. Confirm Medium severity. An improving outcome rate does not remove the evidence-quality concern.
3. Open **Review opportunity: Make dispute evidence guidance specific**. Inspect its linked issue, existing decision and reason-specific checklist action. Record a new decision with rationale, accountable owner, review date and Medium human priority; reload to inspect the appended history.
4. Add an action to test reason-specific examples with partner operations. Assign its owner and due date. Save a partner follow-up draft and verify it remains **Draft · not sent** after reload. Nothing is transmitted by Relay.
5. For the empty-evidence case, open `/partners/meridian?metric=dispute-success&period=2026-09`: performance remains available, but the context explicitly says no accepted source evidence. Do not infer a partner complaint from its rate alone.

## Files

Added `src/lib/evidence.ts`, `src/components/evidence.tsx`, `tests/evidence.test.ts` and `tests/stage3.spec.ts`. Extended performance, Feedback, partner/issue and opportunity components plus scoped CSS. Existing decision/action/communication mutations are reused rather than replaced. No fixture counts or metric targets changed.

`tests/workflow.spec.ts` now scopes the existing issue-link locator to its table: the same issue also appears in the new context links. Stage 3 browser tests use exact accessible form-control names. Initial runs exposed these ambiguous test selectors; the selectors were corrected rather than changing working decision behaviour.

## Verification and design review

- `npm test`: 38 unit/data tests passed, including exact quote integrity, accepted-only evidence, partner scope, legacy protection and decision/action preservation.
- `npm run typecheck`: passed.
- `npm run test:e2e -- tests/stage3.spec.ts`: 3 passed, covering both walkthroughs, saved ownership/actions/drafts, absent evidence, and eight desktop/mobile captures.
- `npm run test:e2e -- tests/stage2.spec.ts tests/workflow.spec.ts`: 8 passed. The dashboard accessibility checks cover nine page/viewport combinations with no serious/critical axe violations; Stage 3 does not claim a full application accessibility audit.

Screenshots are in `.impeccable/review/stage3/`. Impeccable's independent finish review accepted this scoped extension with no material fixes. It noted the longer context groups on mobile issue pages, but found the metric headings readable and opportunity decision controls discoverable. Broader refinement remains Stage 4.

Impeccable's documentation review confirmed preservation of the existing palette, typography, responsive link layout, flat surfaces and evidence disclosures. This extension requires no changes to `DESIGN.md` or its sidecar.

## Scope boundary

Stage 4 owns the broad design/accessibility refinement. Stage 5 owns final release QA and deployment preparation. No publishing is authorised by this checkpoint. The original AI extraction remains disabled under the no-spend requirement.
