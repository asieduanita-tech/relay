# Approved metric and copy revision — 22 October 2026

Implemented locally. No GitHub push, deployment, paid service or live AI request.

## Review

Open http://127.0.0.1:3000/ with all partners and September selected:

| Metric | Rate | Month-over-month |
| --- | --- | --- |
| Successful payments | 99.70% | +1.50 pp |
| Reversed payment rate | 0.16% | −1.35 pp |
| Successful disputes | 43.52% | +1.87 pp |
| Timed out payment attempts | 1.50% | −7.31 pp |
| Flagged inbound payments (Risk & Compliance) | 1.43% | −10.49 pp |

Disputes follow the latest clarification: the rate moves from approximately 41.65455778% to 43.52%, displayed as +1.87 pp. The earlier relative comparison has been removed. Raw-count calculations drive every rate; no rendered number is a hardcoded override. Six complete months and all five fictional partners remain available. Requested rates are intentionally identical across partners, with weighted volumes; they do not imply real partner performance differences.

Overview defaults to these five metrics. Product filters expose retained metrics; Partners also retains all metrics, including KYC approval and Risk review SLA. There are now nine definitions, 270 observations and 54 authored historical notes. Existing reviewed sources, findings, action state and decision history are preserved. Fixture-v1 workspaces receive only a replacement authored performance collection in memory, saved on the next normal mutation.

Open **Synthetic partner context · September 2026** on Overview or `/feedback` to read the revised fictional observations: beneficiary-account reminders and falling reversals; an improved escalation guide and stronger dispute evidence; late OTP delivery behind timeout concerns; suspected friends-and-family inbound payments inconsistent with declared purpose. These notes are contextual observations, not validated causal explanations or confirmed misconduct. They remain separate from reviewed source counts and the October source timeline. Scenario evidence/decision linking remains Stage 3 work.

Both requested taglines are removed. The sidebar profile shows **Demo operator**, with DO initials. Avery Chen remains an existing fictional action/decision owner; saved ownership was not erased.

## Files and checks

Changed metric definitions, fixture generation, workspace compatibility, selection/formatting helpers, performance/feedback/dashboard/shell/shared header components, relevant tests, metric dictionary and sample export. Historical Stage 1/2 checkpoint documents now point here to prevent obsolete figures being mistaken for current output.

Verification: 33 unit/data tests passed; TypeScript and route generation passed; final combined dashboard/workflow browser run passed all 7 tests. Nine dashboard page/viewport captures at 390, 1024 and 1440 px retain bounded layouts and have no serious/critical axe violations. Overview was visually inspected using Impeccable's existing-system craft guidance. This does not replace the planned Stage 4 review or Stage 5 release QA.

The initial browser run overlapped development of the final relative-growth clarification and encountered a workflow timeout; the subsequent complete run against the settled implementation passed. Nothing was published.

Latest copy clarification: failed payments also affect successful payments. No separate failed-payment metric is displayed; successful terminal attempts are divided by all eligible successful and failed terminal attempts. Reversals use a different post-settlement cohort and are not the complement of success.

## Latest issue and opportunity alignment

The five current product problems are closed beneficiary accounts (High), wrong beneficiary account details (High), weak dispute evidence under broad guidelines (Medium), late OTPs for card payments (High), and suspected F&F receipts to business multicurrency accounts (Medium). Source quotations, finding offsets, classifications, historical September context, opportunity outcomes, initial decision rationales and default actions now align with these scenarios. The previous six default issues have been replaced with these five as requested. KYC and Risk quantitative metrics remain available.

The Feedback page no longer includes “Evidence before inference”; its source list uses the available width. The broad-guidelines concern can coexist with an improving dispute win rate; a declining timeout or flagged-inbound rate does not imply that the remaining partner problem is resolved.

Untouched older demo workspaces receive the new sample content. Workspaces with operator changes retain their original evidence and decisions: use a fresh browser session to review the revised samples, or deliberately reset through Demo guide if those edits are no longer needed. No reset was performed automatically on modified workspaces.

Latest verification: 35 unit/data tests and TypeScript passed; all 6 dashboard browser tests passed on rerun, and both workflow regression tests passed. The rerun resolved a duplicate-text test locator and an intermittent axe scan timeout. Nine dashboard viewport checks passed with no serious/critical axe violations; the revised Overview screenshot was visually inspected.
