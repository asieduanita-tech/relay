# Relay metric dictionary — synthetic fixture v4

All numbers and quotations are authored demo material. They describe fictional accounts, not Monzo, Morgan Stanley, Capitec, Nubank or UniCredit performance. They are not an evaluation of a real product or an AI inference.

## Reporting contract

- Six complete calendar months: April–September 2026; snapshot as of 21 October 2026, 00:00 UTC.
- Period start is inclusive, end is exclusive. September is [2026-09-01T00:00:00Z, 2026-10-01T00:00:00Z).
- October's existing feedback is preserved but is outside this operational series. Never compare an October partial period to a completed month.
- One observation per partner × primary metric × month: 5 partners × 9 metrics × 6 periods = 270 records. Every partner has a value in all five areas for all months; this is synthetic coverage, not a claim about a real bank's product adoption.
- Each observation stores integer numerator, eligible denominator and excluded count. Excluded items never enter the rate. Excluded counts are not a second denominator or a unique-transaction throughput measure; event and snapshot assignment rules are defined below. Exceptions eligible for the rate = denominator − numerator.
- Percentage = sum(numerator) / sum(denominator) × 100. Aggregate raw counts, never average displayed partner percentages. Keep full precision until display; show at most two decimals, with raw counts available.
- Compare the same partner selection and metric in adjacent calendar months. Change is current rate − previous rate in **percentage points (pp)** for every metric. April's comparison is unavailable because March is absent.
- Zero eligible denominator: unavailable (`null`), not 0%. A complete eligible population with no successes is legitimately 0%.
- Missing selected partner/month: aggregate counts and coverage can be inspected, but the aggregate rate and month-over-month change are unavailable. Never silently compare different partner cohorts. An explicit empty partner selection is unavailable; an omitted selection means all five partners.
- No composite score averages these unrelated metrics. No real targets, real benchmarks, revenue impact or causal effect are implied. Higher KYC approval alone does not establish compliant or better verification; approval mix and control quality require human interpretation.

## Definitions

| ID / area | Numerator | Eligible denominator and period assignment | Exclusions |
| --- | --- | --- | --- |
| `payment-success` / Cross-border payments | Successful terminal payment attempts | Successful + failed terminal attempts, assigned by UTC terminal-status timestamp | Pending attempts; attempts cancelled before acceptance |
| `payment-reversal` / Cross-border payments | Payments reversed in a 30-day post-settlement window | Settled payments whose observation window closes in the month | Unsettled, cancelled, test payments |
| `dispute-success` / Cards | Closed disputes decided in the customer’s favour | Final won or lost outcomes in the month | Open, withdrawn, duplicate disputes |
| `card-timeout` / Cards | Attempts ending in timeout | Eligible attempts initiated in the month, including timed-out attempts | Test, pre-submission cancellations |
| `inbound-flagged` / Multi-currency accounts, Risk & Compliance context | Inbound payments flagged for suspected use inconsistent with declared purpose | Eligible inbound payments received in the month | Test, duplicate, rejected-before-receipt records |
| `reference-completeness` / Multi-currency accounts | Eligible rows with a non-empty settlement reference | Posted settlement rows, assigned by UTC export timestamp | Opening balances, summaries, non-settlement rows |
| `dispute-deadline` / Cards, including disputes | Cases with complete evidence submitted at or before deadline | Cases requiring evidence whose UTC evidence deadline falls in the month | Withdrawn cases; cases not requiring evidence |
| `kyc-first-approval` / End-user KYC | Approved completed first attempts | Approved + rejected completed first attempts, assigned by UTC decision timestamp | Pending/abandoned first attempts, retries, test identities |
| `risk-sla` / Risk & Compliance | Reviews completed at or before their SLA deadline | Reviews whose UTC SLA deadline falls in the month, including open overdue cases | Duplicate or cancelled reviews |

A payment retry is a separate attempt, not a unique payment. An exported statement row is the unit, not a unique transaction/account. Each dispute case is counted once; missing evidence at deadline is an eligible failure, even if the case remains open. Each first KYC attempt is counted once, not each uploaded document.

Risk SLA means two business days with a simplified Monday–Friday UTC calendar, no holidays and no clock pauses. Deadline classifications are authored aggregate inputs, not real case timestamps or an implemented business-calendar engine. This is not a claim that any bank follows that SLA.

## Fixture authorship and qualitative context

The requested five Overview metrics use authored integer counts with partner-weighted denominators. The same target rates are deliberately used for all five fictional partners, avoiding invented partner performance differences. The four retained metrics keep their earlier varying volumes and trends. Counts, not formatted display values, remain authoritative.

| Overview metric | August | September | Change |
| --- | --- | --- | --- |
| Successful payments | 98.20% | 99.70% | +1.50 pp |
| Reversed payment rate | 1.51% | 0.16% | −1.35 pp |
| Successful disputes | approximately 41.65455778% | 43.52% | +1.87 pp |
| Timed out payment attempts | 8.81% | 1.50% | −7.31 pp |
| Flagged inbound payments (Risk & Compliance) | 11.92% | 1.43% | −10.49 pp |

The dispute baseline uses numerator 4,300 and denominator 10,323 per partner-weight unit; September uses 4,352 / 10,000. The displayed month-over-month difference is approximately +1.86544 pp, rounded to +1.87 pp. All metrics now use percentage points.

Fifty-four authored historical notes cover each metric/month, rotating partners. September context describes improving success and fewer reversals with beneficiary-account reminders, stronger dispute evidence after escalation-guide improvements, late OTP delivery behind timeout concerns, and suspected friends-and-family receipts inconsistent with declared account purpose. These explanations are fictional partner observations, not causal proof; flagged transactions are not confirmed misuse. Notes appear in disclosures on Overview and Feedback separately from reviewed source counts. Default demo source records and findings have been revised to the five approved product problems. Modified workspaces keep their original evidence and operator decisions; a fresh session shows the revised sample.

## Model and compatibility

`Workspace.schemaVersion = 2` identifies the data shape. `Workspace.version` remains the independent mutable revision counter. `Workspace.performance.fixtureVersion = 4` identifies the authored performance fixture.

`performance` contains products, periods, definitions, observations and historical feedback. The existing `sources`, `findings`, `issues`, `opportunities`, decision histories and actions remain intact. Historical notes remain separate from reviewed sources; existing source counts are unchanged. Loading fixture v1 or v2 upgrades only authored performance to fixture v4, preserving sources, findings, decisions and actions.

Legacy workspaces without a schema version (or with version 1) receive the new collection in memory when loaded. The next ordinary workspace mutation persists the upgraded document through the existing row lock or local atomic-write path. Reads alone do not rewrite the stored document. Future/unknown schema versions are rejected rather than resetting operator work. No SQL schema change, production database write, cloud resource or paid service is needed for this stage.

The fixture validator checks complete coverage and stable metric definitions. Calculation helpers separately tolerate incomplete data by returning null with coverage information. Definitions compare field values independently of object-key ordering so PostgreSQL JSONB round-trips remain valid.

## Exclusion period assignment

Payment pending exclusions are attempts initiated in the month still pending at month-end; pre-acceptance cancellations use their cancellation timestamp. A pending April attempt can be a terminal May observation later: exclusions are not an additional denominator and must not be summed across months to claim unique payment volume.

KYC pending exclusions use the initiation month plus month-end pending state; abandoned first attempts use abandonment date; retries/test identities use decision date. Categories are mutually exclusive within each month's excluded count. Dispute exclusions use the original evidence deadline, including withdrawn/no-evidence-required cases with a nominal deadline. Risk exclusions use the original nominal SLA deadline. Statement exclusions use export timestamp, like eligible rows. These are explicit authored aggregate classifications; the demo does not claim event-level banking records exist behind these counts.

Latest copy clarification: failed payments also affect successful payments. No separate failed-payment metric is displayed; successful terminal attempts are divided by all eligible successful and failed terminal attempts. Reversals use a different post-settlement cohort and are not the complement of success.
