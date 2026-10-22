> Historical checkpoint: metric figures below were superseded by the approved revisions in [METRIC_REVISION.md](METRIC_REVISION.md).

# Stage 2 checkpoint — Overview and Partners

Status: implemented locally; awaiting approval before Stage 3. Nothing pushed or deployed.

## Review locally

The development server is running at http://127.0.0.1:3000 with cloud database access disabled for this process. All performance data and partner complaints are synthetic. AI remains disabled; this stage makes no model requests.

1. Open `/`. September defaults to five separate product metrics. Payments show **92.30%, −2.60 pp**, and cards show **84.21%, −3.23 pp**. Check the raw numerator and denominator beside each rate.
2. Choose a partner, product and month, then reload. Selections remain in the URL. Use **View trend** and **View monthly counts and calculation** to inspect all six months, exclusions and the definition. April correctly has no preceding comparison.
3. Open `/partners`, choose **Cards, including disputes** and **September 2026**, then open **Nuvia Bank**. Its detail retains those filters and shows **255 / 302 = 84.44%, −3.23 pp**. The path fixes the partner so conflicting URL parameters cannot change its identity.
4. Inspect Overview and both partner pages at desktop, tablet and mobile widths. Tables scroll within their own bounds on narrow screens; the page should not overflow horizontally.
5. Feedback and follow-through remain below performance. The April–September reporting-month selector does not claim to filter October source feedback; separate feedback date controls explain their scope.

## Changes

- Added shared performance filters, metric tables, six-month trends, calculation details and partner comparisons in `src/components/performance.tsx`.
- Added query validation, formatting and shared selection rules in `src/lib/performance-view.ts`. Rapid sequential selections retain earlier choices; invalid filters and missing observations show actionable or unavailable states rather than fabricated zero rates.
- Extended `src/components/dashboard.tsx` and `src/components/partners.tsx` while preserving the existing feedback summaries, source timeline and navigation.
- Adjusted `src/components/ui.tsx` so Overview feedback date controls preserve the selected performance partner and product.
- Added scoped styles to `src/app/globals.css`, preserving Relay’s forest navigation, Newsreader headings, Inter working text, sage charts and fine table borders. Corrected source timeline date contrast.
- Added `tests/performance-view.test.ts` and `tests/stage2.spec.ts`. Updated a checkbox locator in `tests/workflow.spec.ts` to survive the existing asynchronous save/remount; opportunity behaviour was not changed.

## Verification and Impeccable

Observed results on 21 October 2026:

- `npm test`: **30 passed**.
- `npm run typecheck`: passed, including route type generation.
- `npm run test:e2e -- tests/stage2.spec.ts`: **4 passed**.
- `npm run test:e2e -- tests/workflow.spec.ts`: **2 passed**.
- Nine rendered page/viewport combinations (Overview, Partners and partner detail at 390, 1024 and 1440 px) had no document horizontal overflow and no serious or critical axe violations. This is a scoped automated check, not a claim of complete accessibility conformance.

Screenshots and axe results are in `.impeccable/review/stage2/`. Impeccable reviewed the incumbent system and rendered dashboards. Its finish review identified cramped comparison filters at tablet width; a wrapping grid resolved the issue, the captures were refreshed and the reviewer confirmed the fix. Broader design refinement remains Stage 4.

Impeccable’s documentation review confirmed this is an ordinary extension of the existing palette, typography, flat bordered surfaces, responsive tables and evidence presentation. `DESIGN.md` and its sidecar require no changes for this stage; existing metadata approximations were not rewritten.

Browser tests use deterministic local workspace fixtures. Production database upgrades and deployment were not exercised. A full release build/security review remains Stage 5.

## Assumptions and boundary

Calculations retain the Stage 1 contract in [METRICS.md](METRICS.md): weighted raw counts, consistent cohorts, percentage-point comparisons and no composite health score. Missing required observations make an aggregate unavailable. Month labels use UTC calendar periods.

New historical feedback is not yet connected to these metrics in the UI. Metric-to-source evidence, opportunity drill-downs and the two detailed payment/dispute decision scenarios are Stage 3 work and have not started. Existing issue detail behaviour remains unchanged.

Approve this checkpoint before Stage 3. Publishing and deployment require separate explicit approval.
