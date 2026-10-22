> Historical checkpoint: metric figures below were superseded by the approved revisions in [METRIC_REVISION.md](METRIC_REVISION.md).

# Stage 1 checkpoint — data model and metric definitions

Status: implemented locally; awaiting approval before Stage 2. Nothing pushed or deployed.

## Review the data

Run `node --import tsx scripts/inspect-stage1.ts` from the project root. This reads authored local fixtures only; it does not load credentials, query a database or call an AI provider. The exact output is also saved in [stage-1-samples.json](stage-1-samples.json).

Inspect [METRICS.md](METRICS.md) for reporting rules, formulas, eligibility, exclusions and assumptions. Inspect `src/lib/metrics.ts` for the types, definitions, validation and calculation helpers; `src/lib/performance-seed.ts` contains the deterministic fixture generator and original historical feedback.

The dataset is `workspace.performance`: 5 products, 6 complete monthly periods, 5 definitions, 150 observations and 30 original historical feedback notes. Partner IDs reuse the existing five fictional accounts.

Example observation, all synthetic:

```json
{
  "id": "metric-v1:moss:payments:2026-09",
  "partnerId": "moss",
  "productId": "payments",
  "metricId": "payment-success",
  "periodId": "2026-09",
  "numerator": 13242,
  "denominator": 14400,
  "excludedCount": 360,
  "synthetic": true,
  "provenance": "Authored synthetic aggregate · performance-v1; no real banking telemetry"
}
```

The corresponding September Moss Bank note says: “Failed cross-border attempts need investigation before retrying. Please give operations a failure reason and a next step.” It is authored fictional feedback, not a quotation from a real company. Its observation context is not a claim of causality.

## September all-partner reconciliation

| Synthetic metric | Numerator / denominator | Rate | August → September |
| --- | --- | --- | --- |
| Terminal payment success | 81,076 / 87,840 | 92.30% | −2.60 pp |
| Settlement reference completeness | 171,640 / 175,680 | 97.70% | +0.70 pp |
| Dispute evidence deadline adherence | 1,109 / 1,317 | 84.21% | −3.23 pp |
| First-attempt KYC approval | 20,565 / 23,424 | 87.79% | +1.60 pp |
| Risk review SLA adherence | 2,918 / 3,075 | 94.89% | +1.19 pp |

Values are rounded only for this table. Full-precision results and all six monthly numerator/denominator pairs appear in the sample artifact.

## Files changed

Modified: `src/lib/types.ts`, `src/lib/seed.ts`, `src/lib/store.ts`.

Added: `src/lib/metrics.ts`, `src/lib/performance-seed.ts`, `src/lib/workspace-upgrade.ts`, `tests/metrics.test.ts`, `scripts/inspect-stage1.ts`, and these three review documents/artifacts.

No page or component was edited. Live-AI blocking is unchanged. Existing feedback remains 21 sources, 18 accepted findings and 3 suggestions, with the same issues, owners and decisions. No new source review claims or scenario decision links are introduced.

## Verification

Observed result: all 26 tests passed (11 original + 15 Stage 1 tests), and TypeScript/route type generation passed.

Run `npm test` and `npm run typecheck`. Tests cover the original behaviour plus complete fixture coverage, synthetic labels, deterministic independent copies, weighted aggregation, partner selection, missing/zero data, percentage-point comparisons, invalid counts, invalid relationships, duplicate grains, calendar boundaries, feedback context, and additive/idempotent upgrade preservation including JSONB key ordering.

Storage compatibility is tested as a pure upgrade with serialized workspace round-trips. No production database was touched. Browser interaction and live database upgrade tests are reserved for later approved stages; the new dataset has no UI in Stage 1.

## Approval boundary

Stage 2 would add visible performance trends, comparisons and filters to Overview and Partners using the current Relay design system. It has not started. Review this data contract and test output before approving it.
